module.exports = {


  friendlyName: 'View manufacturers',


  description: 'Display "Manufacturers" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/tobacco/manufacturers'
    }

  },


  fn: async function (inputs, exits) {
    let manufacturers = await Manufacturer.find().populate('lines').sort('name ASC');
    manufacturers = await Promise.all(manufacturers.map(async (manufacturer) => {
      manufacturer.lines = await Promise.all(manufacturer.lines.map(async (line) => {
        let blends = await Blend.find({line: line.id}).populate('flavour');
        line.blends = blends;
        return line;
      }));
      return manufacturer;
    }));
    return exits.success({ manufacturers });
  }


};
