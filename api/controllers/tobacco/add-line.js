module.exports = {


  friendlyName: 'Add line',


  description: 'Add a new tobacco line to the database.',


  inputs: {
    name: {
      type: 'string',
      required: true
    },
    description: {
      type: 'string'
    },
    manufacturer: {
      type: 'string',
      required: true
    }
  },


  fn: async function (inputs, exits) {
    let newLine = await Line.create(inputs).fetch();
    console.log('Added new line:');
    console.log(newLine);
    return exits.success(newLine);
  }


};
