export default data => {
  data.addressName = data.formatted_address;
  data.lat = data.geometry.location.lat;
  data.lng = data.geometry.location.lng;
  return data;
};
