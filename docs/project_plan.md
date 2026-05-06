# Project Plan

## Goals

- Collect relevant flood hazard, exposure, and administrative boundary data.
- Clean and standardize spatial datasets.
- Analyze exposure patterns across Italian regions or municipalities.
- Produce maps, figures, and summary reports.

## Milestone 2: Building exposure layer

Study area: Comune di Forlì, Emilia-Romagna, Italy

Flood hazard layer:
- ISPRA National Mosaic of Flood Hazard Zones, v5.0, 2020
- Scenario used: Medium Probability Hazard (MPH)

Building data:
- OpenStreetMap buildings downloaded using QuickOSM
- Saved layer: data/processed/forli_buildings_osm.gpkg

Exposure method:
- Buildings were selected if their geometry intersects the clipped MPH flood hazard layer.

Preliminary result:
- Exposed buildings: 40,415

Important note:
This is a preliminary exposure count. The result should be validated later because the ISPRA MPH hazard polygon covers a large part of the Forlì municipality, and the current method counts any building that intersects the hazard area.

## Milestone 3: Road exposure layer

Road data:
- OpenStreetMap roads downloaded using QuickOSM
- Saved layer: data/processed/forli_roads_osm.gpkg

Exposure method:
- Roads were clipped by the clipped ISPRA Medium Probability Hazard flood layer.
- A new field `length_km` was calculated using `$length / 1000`.

Preliminary result:
- Affected road segments: 5,548
- Total affected road length: 1,064.90 km
- Mean affected segment length: 0.192 km
- Median affected segment length: 0.082 km

Important note:
This is a preliminary affected-road estimate. The value depends on the extent of the ISPRA MPH hazard layer and should be validated later using additional hazard scenarios or alternative exposure definitions.

Preliminary result:
- Total mapped schools: 18
- Exposed schools: 18
- School exposure rate: 100%

Important note:
All mapped OSM school points intersect the ISPRA Medium Probability Hazard flood layer within Forlì. This result should be validated because the MPH hazard layer covers a large part of the municipality and OSM school mapping may represent schools as points rather than full campus/building geometries.

## Milestone 4: Critical services exposure

School data:
- OpenStreetMap schools downloaded using QuickOSM
- Saved layer: data/processed/forli_schools_osm.gpkg
- Exposed layer: data/processed/forli_schools_exposed_mph.gpkg

Hospital data:
- OpenStreetMap hospitals downloaded using QuickOSM
- Saved layer: data/processed/forli_hospitals_osm.gpkg
- Exposed layer: data/processed/forli_hospitals_exposed_mph.gpkg

Exposure method:
- Schools and hospitals were selected if their point geometry intersects the clipped ISPRA Medium Probability Hazard flood layer.

Preliminary result:
- Total mapped schools: 18
- Exposed schools: 18
- School exposure rate: 100%
- Total mapped hospitals: 9
- Exposed hospitals: 2
- Hospital exposure rate: 22.2%

Important note:
These are preliminary critical-service exposure counts. OSM may represent schools and hospitals as points, polygons, or multiple mapped objects. The results should be validated before final reporting.

## Milestone 5: WebGIS prototype v1

A first browser-based WebGIS prototype was created using Leaflet.

WebGIS layers:
- Forlì administrative boundary
- ISPRA Medium Probability Hazard flood layer
- affected roads
- exposed schools
- exposed hospitals

Dashboard indicators:
- Exposed buildings: 40,415
- Total affected road length: 1,064.90 km
- Exposed schools: 18 / 18
- Exposed hospitals: 2 / 9

Design notes:
- Exposed buildings are shown as a dashboard metric but are not loaded as a GeoJSON layer in version 1 because the exported file is too large for smooth browser performance.
- The current prototype prioritizes clarity, speed, and simple communication of exposure indicators.

Output:
- outputs/figures/floodlens_webgis_v1.png

Update:
- A map legend was added to explain flood hazard, affected roads, exposed schools, exposed hospitals, and the Forlì boundary.
- The initial map view was adjusted to focus more closely on the Forlì urban area.
- Output screenshot: outputs/figures/floodlens_webgis_v2_legend_zoom.png