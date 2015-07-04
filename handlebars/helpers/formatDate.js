module.exports = {

  formatDate: function(date) {

    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if (typeof (date) == 'undefined') {
      return 'Unknown';
    }

    return (monthNames[date.getMonth()]) + ' ' + (date.getDate()) + ', ' + date.getFullYear();
  }

};
