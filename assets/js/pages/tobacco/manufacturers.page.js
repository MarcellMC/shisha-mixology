parasails.registerPage('manufacturers', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    // Manufacturers
    // manufacturers: [], // list of brands on the page
    addManufacturerModalOpen: false,
    addManufacturerFormData: {
      name: '',
      description: ''
    },

    // Lines
    // lines: [], // list of lines on the page
    selectedManufacturer: {},
    addLineModalOpen: false,
    addLineFormData: {
      name: '',
      description: '',
      manufacturer: ''
    },

    // Flavours and blends
    // blends: [], // list of blends on the page
    selectedLine: {},
    addBlendModalOpen: false,
    addBlendFormData: {
      flavourName: '',
      flavourDescription: '',
      flavourFeatures: '',
      blendStrength: '',
      line: ''
    },

    // Syncing/loading state
    syncing: false,
    // Validation errors
    formErrors: {},
    // Server error state
    cloudError: '',
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
  },
  mounted: async function() {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    // Add Manufacturer
    clickAddManufacturer: function() {
      this.addManufacturerModalOpen = true;
    },

    _clearAddManufacturerModal: function() {
      this.addManufacturerModalOpen = false;
      this.addManufacturerFormData = {
        name: '',
        description: ''
      };
      this.formErrors = {};
      this.cloudError = '';
    },

    closeAddManufacturerModal: function() {
      this._clearAddManufacturerModal();
    },

    handleParsingAddManufacturerForm: function() {
      this.formErrors = {};
      if (Object.keys(this.formErrors).length > 0) {
        return;
      }

      console.log('Manufacturers before adding:');
      console.log(this.manufacturers);

      return { ...this.addManufacturerFormData };
    },

    submittedAddManufacturerForm: function(newManufacturer) {
      // Add a freshly created brand to our page
      console.log('Manufacturers before adding:');
      console.log(this.manufacturers);
      this.manufacturers.unshift(newManufacturer);
      console.log('Manufacturers after adding:');
      console.log(this.manufacturers);
      this.closeAddManufacturerModal();
    },


    // Add Line
    clickAddLine: function(manufacturer) {
      this.selectedManufacturer = manufacturer;
      this.addLineModalOpen = true;
    },

    _clearAddLineModal: function() {
      this.addLineModalOpen = false;
      this.addLineFormData = {
        name: '',
        description: '',
        manufacturer: ''
      };
      this.formErrors = {};
      this.cloudError = '';
    },

    closeAddLineModal: function() {
      this._clearAddLineModal();
    },

    handleParsingAddLineForm: function() {
      this.formErrors = {};
      if (Object.keys(this.formErrors).length > 0) {
        return;
      }
      this.addLineFormData.manufacturer = this.selectedManufacturer.id;
      return { ...this.addLineFormData };
    },

    submittedAddLineForm: function(newLine) {
      // Add a freshly created line to our page
      let manufacturer = this.manufacturers.find(item => item.id === this.selectedManufacturer.id);
      manufacturer.lines.unshift(newLine);
      this.closeAddLineModal();
    },

    // Add Blend
    clickAddBlend: function(line, manufacturer) {
      this.selectedManufacturer = manufacturer;
      this.selectedLine = line;
      this.addBlendModalOpen = true;
    },

    _clearAddBlendModal: function() {
      this.addBlendModalOpen = false;
      this.addBlendFormData = {
        name: '',
        description: '',
        manufacturer: ''
      };
      this.formErrors = {};
      this.cloudError = '';
    },

    closeAddBlendModal: function() {
      this._clearAddBlendModal();
    },

    handleParsingAddBlendForm: function() {
      this.formErrors = {};
      if (Object.keys(this.formErrors).length > 0) {
        return;
      }

      console.log('Lines before adding:');
      console.log(this.selectedManufacturer.lines);

      this.addBlendFormData.line = this.selectedLine.id;
      let flavourFeatures = this.addBlendFormData.flavourFeatures;
      if (flavourFeatures !== undefined) {
        this.addBlendFormData.flavourFeatures = {taste: flavourFeatures.split(', ')}; // ToDo. Add basic parsing: trim, downcase. Add support for features other than taste.
      }
      return { ...this.addBlendFormData };
    },

    submittedAddBlendForm: function(newBlend) {
      // Add a freshly created blend to our page
      let line = this.selectedManufacturer.lines.find(item => item.id === this.selectedLine.id);
      line.blends.unshift(newBlend);
      console.log('Flavour:');
      console.log(newBlend.flavour);
      console.log('Flavour name:');
      console.log(newBlend.flavour.name);
      this.closeAddBlendModal();
    }
  }
});
