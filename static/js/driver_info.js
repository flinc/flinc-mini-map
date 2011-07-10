var DriverInfo = Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, 'render');
  },

  className: 'bubble',

  render: function() {
    var el = $(this.el);

    el.append($('<img src="' +  this.model.get('gravatar') + '"/>'));
    var text = $('<div class="text"/>')
      .append('<p class="hint">flinc mini #' + this.model.get('id') + '</p>')
      .append('<p class="name">' + this.model.get('name') + '</p>')
      .appendTo(el)

    return this;
  }
});