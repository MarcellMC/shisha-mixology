module.exports = {


  friendlyName: 'View top mixtures',


  description: 'Display "Top mixtures" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/mixtures/top-mixtures'
    }

  },


  fn: async function (inputs, exits) {
    let mixtures = await Mixture.find().populate('user');
    return exits.success({ mixtures });
  }


};
