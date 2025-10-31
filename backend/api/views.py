"""
ELD Trip Planner API Views - FIXED VERSION
Handles route calculation, HOS compliance, and log generation
Fixed: Added rate limiting and better error handling for geocoding
"""
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import requests
from datetime import datetime, timedelta
import math
import time

# Constants for HOS Rules (70-hour/8-day cycle)
MAX_DRIVING_HOURS = 11
MAX_ON_DUTY_WINDOW = 14
REQUIRED_OFF_DUTY = 10
BREAK_AFTER_DRIVING = 8
BREAK_DURATION = 0.5
MAX_WEEKLY_HOURS = 70
FUEL_STOP_MILES = 950
AVERAGE_SPEED = 60  # mph

# Cache for geocoding to avoid repeated requests
GEOCODE_CACHE = {}

def geocode_location(location):
    """Convert location string to coordinates using Nominatim (OpenStreetMap)"""
    # Check cache first
    cache_key = location.lower().strip()
    if cache_key in GEOCODE_CACHE:
        print(f"Using cached coordinates for: {location}")
        return GEOCODE_CACHE[cache_key]
    
    try:
        # Add delay to respect rate limits (1 request per second for Nominatim)
        time.sleep(1.0)
        
        url = f"https://nominatim.openstreetmap.org/search"
        params = {
            'q': location,
            'format': 'json',
            'limit': 1
        }
        headers = {
            'User-Agent': 'ELD-Trip-Planner/1.0 (Educational Project)',
            'Accept': 'application/json'
        }
        
        print(f"Geocoding: {location}")
        response = requests.get(url, params=params, headers=headers, timeout=10)
        
        if response.status_code == 429:
            print("Rate limit hit, waiting longer...")
            time.sleep(5)
            response = requests.get(url, params=params, headers=headers, timeout=10)
        
        if response.status_code != 200:
            print(f"Geocoding failed with status: {response.status_code}")
            return None
            
        data = response.json()
        
        if data and len(data) > 0:
            result = {
                'lat': float(data[0]['lat']),
                'lon': float(data[0]['lon']),
                'display_name': data[0].get('display_name', location)
            }
            # Cache the result
            GEOCODE_CACHE[cache_key] = result
            print(f"Successfully geocoded: {location}")
            return result
        else:
            print(f"No results found for: {location}")
            return None
            
    except requests.Timeout:
        print(f"Timeout geocoding: {location}")
        return None
    except requests.RequestException as e:
        print(f"Request error geocoding {location}: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error geocoding {location}: {e}")
        return None

def get_route(start_coords, end_coords):
    """Get route using OSRM for real road routing with fallback"""
    try:
        # Try OSRM first for real road routing
        print(f"Attempting OSRM routing...")
        
        # OSRM API endpoint (public instance)
        url = f"https://router.project-osrm.org/route/v1/driving/{start_coords['lon']},{start_coords['lat']};{end_coords['lon']},{end_coords['lat']}"
        
        params = {
            'overview': 'full',
            'geometries': 'geojson',
            'steps': 'false'
        }
        
        headers = {
            'User-Agent': 'ELD-Trip-Planner/1.0'
        }
        
        response = requests.get(url, params=params, headers=headers, timeout=15)
        
        if response.status_code == 200:
            data = response.json()
            
            if data.get('code') == 'Ok' and data.get('routes'):
                route = data['routes'][0]
                distance_meters = route['distance']
                duration_seconds = route['duration']
                geometry = route['geometry']['coordinates']
                
                print(f"✓ OSRM routing successful: {distance_meters/1609.34:.1f} miles, {duration_seconds/3600:.1f} hours")
                
                return {
                    'distance': distance_meters / 1609.34,  # Convert to miles
                    'duration': duration_seconds / 3600,    # Convert to hours
                    'geometry': geometry  # [lon, lat] format
                }
        
        print(f"OSRM failed or rate limited, using fallback calculation")
        return calculate_fallback_route(start_coords, end_coords)
        
    except requests.Timeout:
        print("OSRM timeout, using fallback")
        return calculate_fallback_route(start_coords, end_coords)
    except Exception as e:
        print(f"OSRM error: {e}, using fallback")
        return calculate_fallback_route(start_coords, end_coords)

def calculate_fallback_route(start_coords, end_coords):
    """Calculate approximate route when API fails using realistic road distance multiplier"""
    # Haversine formula for straight-line distance
    lat1, lon1 = math.radians(start_coords['lat']), math.radians(start_coords['lon'])
    lat2, lon2 = math.radians(end_coords['lat']), math.radians(end_coords['lon'])
    
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    straight_distance = 3958.8 * c  # Earth radius in miles
    
    # Apply realistic road distance multiplier (roads are not straight)
    # Typical multiplier is 1.2-1.4x for highways, using 1.3 as average
    road_distance = straight_distance * 1.3
    
    # Create a simple curved path (3 intermediate points) for better visualization
    geometry = []
    num_points = 5
    for i in range(num_points):
        t = i / (num_points - 1)
        # Smooth curve interpolation
        lat = start_coords['lat'] + (end_coords['lat'] - start_coords['lat']) * t
        lon = start_coords['lon'] + (end_coords['lon'] - start_coords['lon']) * t
        geometry.append([lon, lat])
    
    return {
        'distance': road_distance,
        'duration': road_distance / AVERAGE_SPEED,
        'geometry': geometry
    }

def calculate_fuel_stops(route_distance, route_geometry):
    """Calculate fuel stop locations along the actual route geometry"""
    fuel_stops = []
    num_stops = max(0, math.ceil((route_distance - FUEL_STOP_MILES) / FUEL_STOP_MILES))
    
    if num_stops == 0:
        return fuel_stops
    
    # If we have detailed geometry, place stops along actual route
    if route_geometry and len(route_geometry) > 2:
        for i in range(num_stops):
            # Calculate distance where stop should be
            stop_distance = (i + 1) * FUEL_STOP_MILES
            progress = stop_distance / route_distance
            
            # Find the geometry point closest to this progress
            target_index = int(progress * (len(route_geometry) - 1))
            target_index = min(target_index, len(route_geometry) - 1)
            
            stop_coords = route_geometry[target_index]
            
            fuel_stops.append({
                'location': f"Fuel Stop {i + 1}",
                'coordinates': {
                    'lat': stop_coords[1],  # geometry is [lon, lat]
                    'lon': stop_coords[0]
                },
                'distance_from_start': stop_distance,
                'duration': 0.5  # 30 minutes
            })
    else:
        # Fallback to linear interpolation if geometry is simple
        start_coords = {'lat': route_geometry[0][1], 'lon': route_geometry[0][0]}
        end_coords = {'lat': route_geometry[-1][1], 'lon': route_geometry[-1][0]}
        
        for i in range(num_stops):
            progress = (i + 1) / (num_stops + 1)
            stop_coords = {
                'lat': start_coords['lat'] + (end_coords['lat'] - start_coords['lat']) * progress,
                'lon': start_coords['lon'] + (end_coords['lon'] - start_coords['lon']) * progress
            }
            fuel_stops.append({
                'location': f"Fuel Stop {i + 1}",
                'coordinates': stop_coords,
                'distance_from_start': route_distance * progress,
                'duration': 0.5
            })
    
    return fuel_stops

def generate_trip_plan(current_loc, pickup_loc, dropoff_loc, current_cycle_used):
    """Generate complete trip plan with HOS compliance"""
    
    print(f"\n=== Starting Trip Calculation ===")
    print(f"Current: {current_loc}")
    print(f"Pickup: {pickup_loc}")
    print(f"Dropoff: {dropoff_loc}")
    print(f"Cycle Used: {current_cycle_used}")
    
    # Geocode locations with error handling
    print("\n--- Geocoding Locations ---")
    current_coords = geocode_location(current_loc)
    if not current_coords:
        return None, f"Unable to geocode current location: {current_loc}"
    
    pickup_coords = geocode_location(pickup_loc)
    if not pickup_coords:
        return None, f"Unable to geocode pickup location: {pickup_loc}"
    
    dropoff_coords = geocode_location(dropoff_loc)
    if not dropoff_coords:
        return None, f"Unable to geocode dropoff location: {dropoff_loc}"
    
    print("All locations geocoded successfully!")
    
    # Get routes
    print("\n--- Calculating Routes ---")
    route_to_pickup = get_route(current_coords, pickup_coords)
    route_to_dropoff = get_route(pickup_coords, dropoff_coords)
    
    total_distance = route_to_pickup['distance'] + route_to_dropoff['distance']
    total_driving_time = route_to_pickup['duration'] + route_to_dropoff['duration']
    
    print(f"Total Distance: {total_distance:.1f} miles")
    print(f"Total Driving Time: {total_driving_time:.1f} hours")
    
    # Calculate fuel stops along actual route geometry
    fuel_stops_leg1 = calculate_fuel_stops(route_to_pickup['distance'], route_to_pickup['geometry'])
    fuel_stops_leg2 = calculate_fuel_stops(route_to_dropoff['distance'], route_to_dropoff['geometry'])
    
    print(f"Fuel Stops: {len(fuel_stops_leg1) + len(fuel_stops_leg2)}")
    
    # Generate detailed trip timeline with HOS compliance
    print("\n--- Generating Timeline ---")
    timeline = []
    current_time = datetime.now()
    available_drive_time = MAX_DRIVING_HOURS
    available_on_duty_time = MAX_ON_DUTY_WINDOW
    hours_until_break = BREAK_AFTER_DRIVING
    cycle_remaining = MAX_WEEKLY_HOURS - current_cycle_used
    
    # Leg 1: Current to Pickup
    remaining_distance = route_to_pickup['distance']
    leg1_fuel_idx = 0
    
    while remaining_distance > 0:
        # Calculate how far we can drive
        drive_segment_time = min(available_drive_time, hours_until_break, remaining_distance / AVERAGE_SPEED)
        drive_segment_distance = drive_segment_time * AVERAGE_SPEED
        
        # Add driving segment
        timeline.append({
            'type': 'driving',
            'start_time': current_time.isoformat(),
            'duration': drive_segment_time,
            'distance': drive_segment_distance,
            'status': 'Driving'
        })
        
        current_time += timedelta(hours=drive_segment_time)
        available_drive_time -= drive_segment_time
        available_on_duty_time -= drive_segment_time
        hours_until_break -= drive_segment_time
        cycle_remaining -= drive_segment_time
        remaining_distance -= drive_segment_distance
        
        # Check for fuel stop
        if leg1_fuel_idx < len(fuel_stops_leg1) and remaining_distance > 0:
            timeline.append({
                'type': 'fuel',
                'start_time': current_time.isoformat(),
                'duration': 0.5,
                'location': fuel_stops_leg1[leg1_fuel_idx]['location'],
                'status': 'On Duty (Not Driving)'
            })
            current_time += timedelta(hours=0.5)
            available_on_duty_time -= 0.5
            cycle_remaining -= 0.5
            leg1_fuel_idx += 1
        
        # Check if we need a 30-min break
        if hours_until_break <= 0 and remaining_distance > 0:
            timeline.append({
                'type': 'break',
                'start_time': current_time.isoformat(),
                'duration': BREAK_DURATION,
                'status': 'Off Duty'
            })
            current_time += timedelta(hours=BREAK_DURATION)
            hours_until_break = BREAK_AFTER_DRIVING
        
        # Check if we need 10-hour rest
        if available_drive_time <= 0.5 or available_on_duty_time <= 0.5 or cycle_remaining <= 0.5:
            timeline.append({
                'type': 'rest',
                'start_time': current_time.isoformat(),
                'duration': REQUIRED_OFF_DUTY,
                'status': 'Sleeper Berth'
            })
            current_time += timedelta(hours=REQUIRED_OFF_DUTY)
            available_drive_time = MAX_DRIVING_HOURS
            available_on_duty_time = MAX_ON_DUTY_WINDOW
            hours_until_break = BREAK_AFTER_DRIVING
    
    # Pickup activity
    timeline.append({
        'type': 'pickup',
        'start_time': current_time.isoformat(),
        'duration': 1,
        'location': pickup_loc,
        'status': 'On Duty (Not Driving)'
    })
    current_time += timedelta(hours=1)
    available_on_duty_time -= 1
    cycle_remaining -= 1
    
    # Check if on-duty window exceeded after pickup
    if available_on_duty_time <= 0.5:
        timeline.append({
            'type': 'rest',
            'start_time': current_time.isoformat(),
            'duration': REQUIRED_OFF_DUTY,
            'status': 'Sleeper Berth'
        })
        current_time += timedelta(hours=REQUIRED_OFF_DUTY)
        available_drive_time = MAX_DRIVING_HOURS
        available_on_duty_time = MAX_ON_DUTY_WINDOW
        hours_until_break = BREAK_AFTER_DRIVING
    
    # Leg 2: Pickup to Dropoff
    remaining_distance = route_to_dropoff['distance']
    leg2_fuel_idx = 0
    
    while remaining_distance > 0:
        drive_segment_time = min(available_drive_time, hours_until_break, remaining_distance / AVERAGE_SPEED)
        drive_segment_distance = drive_segment_time * AVERAGE_SPEED
        
        timeline.append({
            'type': 'driving',
            'start_time': current_time.isoformat(),
            'duration': drive_segment_time,
            'distance': drive_segment_distance,
            'status': 'Driving'
        })
        
        current_time += timedelta(hours=drive_segment_time)
        available_drive_time -= drive_segment_time
        available_on_duty_time -= drive_segment_time
        hours_until_break -= drive_segment_time
        cycle_remaining -= drive_segment_time
        remaining_distance -= drive_segment_distance
        
        if leg2_fuel_idx < len(fuel_stops_leg2) and remaining_distance > 0:
            timeline.append({
                'type': 'fuel',
                'start_time': current_time.isoformat(),
                'duration': 0.5,
                'location': fuel_stops_leg2[leg2_fuel_idx]['location'],
                'status': 'On Duty (Not Driving)'
            })
            current_time += timedelta(hours=0.5)
            available_on_duty_time -= 0.5
            cycle_remaining -= 0.5
            leg2_fuel_idx += 1
        
        if hours_until_break <= 0 and remaining_distance > 0:
            timeline.append({
                'type': 'break',
                'start_time': current_time.isoformat(),
                'duration': BREAK_DURATION,
                'status': 'Off Duty'
            })
            current_time += timedelta(hours=BREAK_DURATION)
            hours_until_break = BREAK_AFTER_DRIVING
        
        if available_drive_time <= 0.5 or available_on_duty_time <= 0.5 or cycle_remaining <= 0.5:
            timeline.append({
                'type': 'rest',
                'start_time': current_time.isoformat(),
                'duration': REQUIRED_OFF_DUTY,
                'status': 'Sleeper Berth'
            })
            current_time += timedelta(hours=REQUIRED_OFF_DUTY)
            available_drive_time = MAX_DRIVING_HOURS
            available_on_duty_time = MAX_ON_DUTY_WINDOW
            hours_until_break = BREAK_AFTER_DRIVING
    
    # Dropoff activity
    timeline.append({
        'type': 'dropoff',
        'start_time': current_time.isoformat(),
        'duration': 1,
        'location': dropoff_loc,
        'status': 'On Duty (Not Driving)'
    })
    
    print(f"Timeline generated: {len(timeline)} events")
    print("=== Trip Calculation Complete ===\n")
    
    return {
        'locations': {
            'current': {'coords': current_coords, 'name': current_loc},
            'pickup': {'coords': pickup_coords, 'name': pickup_loc},
            'dropoff': {'coords': dropoff_coords, 'name': dropoff_loc}
        },
        'route': {
            'total_distance': round(total_distance, 1),
            'total_driving_time': round(total_driving_time, 1),
            'geometry': route_to_pickup['geometry'] + route_to_dropoff['geometry']
        },
        'fuel_stops': fuel_stops_leg1 + fuel_stops_leg2,
        'timeline': timeline
    }, None

@api_view(['POST'])
def calculate_trip(request):
    """Main API endpoint for trip calculation"""
    data = request.data
    
    # Validate inputs
    required_fields = ['current_location', 'pickup_location', 'dropoff_location', 'current_cycle_used']
    for field in required_fields:
        if field not in data:
            return Response(
                {'error': f'Missing required field: {field}'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    try:
        current_cycle_used = float(data['current_cycle_used'])
        if current_cycle_used < 0 or current_cycle_used > MAX_WEEKLY_HOURS:
            return Response(
                {'error': f'Current cycle used must be between 0 and {MAX_WEEKLY_HOURS}'},
                status=status.HTTP_400_BAD_REQUEST
            )
    except ValueError:
        return Response(
            {'error': 'Current cycle used must be a number'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Generate trip plan
    result, error = generate_trip_plan(
        data['current_location'],
        data['pickup_location'],
        data['dropoff_location'],
        current_cycle_used
    )
    
    if error:
        print(f"ERROR: {error}")
        return Response({'error': error}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(result, status=status.HTTP_200_OK)

@api_view(['GET'])
def health_check(request):
    """Health check endpoint"""
    return Response({'status': 'healthy'}, status=status.HTTP_200_OK)