import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  chamber: DS.attr('string'),
  capitalPhone: DS.attr('string'),
  email: DS.attr('string'),
  districtPhone: DS.attr('string'),
});
