# Bangladesh district boundaries

`public/maps/bangladesh-districts.geojson` contains the simplified Bangladesh ADM2 boundary dataset from geoBoundaries, release `9469f09` (boundary ID `BGD-ADM2-16705992`, 2020).

- Dataset: [geoBoundaries Bangladesh ADM2](https://www.geoboundaries.org/api/current/gbOpen/BGD/ADM2/)
- Original source: Bangladesh Bureau of Statistics (BBS), OCHA Regional Office for Asia and the Pacific
- License: Creative Commons Attribution 3.0 Intergovernmental Organisations (CC BY 3.0 IGO)
- Attribution: geoBoundaries, BBS, and OCHA ROAP. The source dataset identifies the license and source at the linked metadata endpoint.

The local file is used as district geometry; district names and division membership are maintained separately in `districts.ts` and `divisions.ts`.

## World country boundaries

`public/maps/world-countries.geojson` uses the Natural Earth 1:110m Admin 0 countries dataset distributed by the Natural Earth Vector project.

- Dataset: [Natural Earth Admin 0 Countries](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson)
- License: Public domain; Natural Earth data is in the public domain.
- Attribution: Natural Earth (naturalearthdata.com).