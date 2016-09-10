import Ember from 'ember';

export default Ember.Route.extend({
    setupController: function(controller) {
      controller.set('introTextHeading', introTextHeading);
      controller.set('introTextSummary', introTextSummary);
      controller.set('introTextSubHeading', introTextSubHeading);
    }
});
