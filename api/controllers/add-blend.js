module.exports = {


  friendlyName: 'Add blend',


  description: 'Add a new tobacco blend to the database.',


  inputs: {
    flavourName: {
      type: 'string',
      required: true
    },
    flavourDescription: {
      type: 'string'
    },
    flavourFeatures: {
      type: 'json'
    },
    blendStrength: {
      type: 'number',
      max: 10
    },
    line: {
      type: 'string',
      required: true
    }
  },


  exits: {

  },


  fn: async function (inputs, exits) {
    console.log('Inputs:');
    console.log(inputs);
    let lineID;
    let flavour = await Flavour.findOne({name: inputs.flavourName});
    if (flavour === undefined) {
      await Flavour.create({name: inputs.flavourName, description: inputs.flavourDescription, features: inputs.flavourFeatures});
      flavour = await Flavour.findOne({name: inputs.flavourName}); // Have to do it, because otherwise 'line' isn't properly populated
      console.log('Added new flavour:');
      console.log(flavour);
      lineID = flavour.line.id;
    }
    else {
      console.log('Found existing flavour:');
      console.log(flavour);
      lineID = inputs.line;
    }
    let newBlend = await Blend.create({strength: inputs.blendStrength, line: lineID, flavour: flavour.id}).fetch();
    newBlend = await Blend.findOne({id: newBlend.id}).populate('flavour'); // Have to do it, because otherwise 'flavour' isn't properly populated
    console.log('Added new blend:');
    console.log(newBlend);
    return exits.success(newBlend);
  }


};
