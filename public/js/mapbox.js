/* eslint-disable */
export const displayMap = promoters => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiYWhtZWRzZXlhbSIsImEiOiJja2I0eWswZ3QwZ2o4MnBwZDc1c2VodjZoIn0.4yTd77Iyk1zlaMrlbo7Urg";
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/ahmedseyam/ckb5btzcf0yv11ip9yhvx4io6",
    scrollZoom: true,
    // center: [-118.113491, 34.111745],
    zoom: 15
    // interactive: false
  });
  let el;
  const bounds = new mapboxgl.LngLatBounds();
  console.log(promoters);
  promoters.forEach(promoter => {
    // Create marker
    promoter.locations.forEach((item, i) => {
      el = document.createElement("div");
      el.className = "marker";

      // Add marker
      new mapboxgl.Marker({
        element: el,
        anchor: "bottom"
      })
        .setLngLat(item.coordinates)
        .addTo(map);

      // Add popup
      new mapboxgl.Popup({
        offset: 30
      })
        .setLngLat(item.coordinates)
        .setHTML(
          `
          <p> ${promoter.email}</p>
          <p> ${promoter.name}</p>
          <p> ${item.address}</p>
          <p> ${promoter.phoneNumber}</p>

          `
        )
        .addTo(map);

      // Extend map bounds to include current location
      bounds.extend(item.coordinates);
    });
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
};
