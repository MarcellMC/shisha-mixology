module.exports = {


  friendlyName: 'Add manufacturer',


  description: 'Add a new tobacco manufacturer to the database.',


  inputs: {
    name: {
      type: 'string',
      required: true
    },
    description: {
      type: 'string'
    }
  },


  fn: async function (inputs, exits) {
    let newManufacturer = await Manufacturer.create(inputs).fetch();
    // newManufacturer = await Manufacturer.findOne({id: newManufacturer.id}).where({name: newManufacturer.name}).populate('lines');
    console.log('Added new manufacturer:');
    console.log(newManufacturer);
    return exits.success(newManufacturer);
  }


};
