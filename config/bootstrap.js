/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function() {

  // Import dependencies
  var path = require('path');

  // This bootstrap version indicates what version of fake data we're dealing with here.
  var HARD_CODED_DATA_VERSION = 6;

  // This path indicates where to store/look for the JSON file that tracks the "last run bootstrap info"
  // locally on this development computer (if we happen to be on a development computer).
  var bootstrapLastRunInfoPath = path.resolve(sails.config.appPath, '.tmp/bootstrap-version.json');

  // Whether or not to continue doing the stuff in this file (i.e. wiping and regenerating data)
  // depends on some factors:
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // If the hard-coded data version has been incremented, or we're being forced
  // (i.e. `--drop` or `--environment=test` was set), then run the meat of this
  // bootstrap script to wipe all existing data and rebuild hard-coded data.
  if (sails.config.models.migrate !== 'drop' && sails.config.environment !== 'test') {
    // If this is _actually_ a production environment (real or simulated), or we have
    // `migrate: safe` enabled, then prevent accidentally removing all data!
    if (process.env.NODE_ENV==='production' || sails.config.models.migrate === 'safe') {
      sails.log('Since we are running with migrate: \'safe\' and/or NODE_ENV=production (in the "'+sails.config.environment+'" Sails environment, to be precise), skipping the rest of the bootstrap to avoid data loss...');
      return;
    }//•

    // Compare bootstrap version from code base to the version that was last run
    var lastRunBootstrapInfo = await sails.helpers.fs.readJson(bootstrapLastRunInfoPath)
    .tolerate('doesNotExist');// (it's ok if the file doesn't exist yet-- just keep going.)

    if (lastRunBootstrapInfo && lastRunBootstrapInfo.lastRunVersion === HARD_CODED_DATA_VERSION) {
      sails.log('Skipping v'+HARD_CODED_DATA_VERSION+' bootstrap script...  (because it\'s already been run)');
      sails.log('(last run on this computer: @ '+(new Date(lastRunBootstrapInfo.lastRunAt))+')');
      return;
    }//•

    sails.log('Running v'+HARD_CODED_DATA_VERSION+' bootstrap script...  ('+(lastRunBootstrapInfo ? 'before this, the last time the bootstrap ran on this computer was for v'+lastRunBootstrapInfo.lastRunVersion+' @ '+(new Date(lastRunBootstrapInfo.lastRunAt)) : 'looks like this is the first time the bootstrap has run on this computer')+')');
  }
  else {
    sails.log('Running bootstrap script because it was forced...  (either `--drop` or `--environment=test` was used)');
  }

  // Since the hard-coded data version has been incremented, and we're running in
  // a "throwaway data" environment, delete all records from all models.
  for (let identity in sails.models) {
    await sails.models[identity].destroy({});
  }//∞

  // By convention, this is a good place to set up fake data during development.
  let user;
  let manufacturer;
  let line;
  let flavour;
  let blend;
  let mixture;

  user = await User.create( {emailAddress: 'atomixer@example.com', fullName: 'Атомный мешатель', isSuperAdmin: false, password: await sails.helpers.passwords.hashPassword('pypuavxc')}).fetch();
  mixture = await Mixture.create({name: 'Промискуитет', shortDescription: 'Умеренно крепкий микс для бодрых духом дам и джентельменов. Опьяняет ароматом экзотических фруктов. Цитрусовые ноты вкупе с клубничными прелестями и нотками корицы напомнят о самых приятных моментах половозрелой жизни.', user: user.id}).fetch();
  manufacturer = await Manufacturer.create({name: 'Satyr', description: 'Пионер российского табачного крафта.'}).fetch();
  line = await Line.create({name: 'High Aroma', description: 'Яркая ароматика.', manufacturer: manufacturer.id}).fetch();
  flavour = await Flavour.create({name: 'Pussy Fruit', description: 'Сочный экстракт Питайя с цветочными ароматами. Вкусовые рецепторы вдохнут новую жизнь, а организм получит истинное наслаждение. Ваша чашка потечёт от удовольствия.', features: {taste: ['питайа', 'цветы']}}).fetch();
  blend = await Blend.create({strength: 6, line: line.id, flavour: flavour.id}).fetch();
  await Component.create({amount: 50, blend: blend.id, mixture: mixture.id});
  manufacturer = await Manufacturer.create({name: 'Element', description: 'Открытие 2018го года.'}).fetch();
  line = await Line.create({name: 'Вода', description: 'Линейка средней крепости.', manufacturer: manufacturer.id}).fetch();
  flavour = await Flavour.create({name: 'Grapefruit and Pomelo', description: 'Грейпфрут и помело.', features: {taste: ['грейпфрут', 'помело', 'цитрус']}}).fetch();
  blend = await Blend.create({strength: 7, line: line.id, flavour: flavour.id}).fetch();
  await Component.create({amount: 20, blend: blend.id, mixture: mixture.id});
  manufacturer = await Manufacturer.create({name: 'Serbetli', description: 'Знаменитые турки.'}).fetch();
  line = await Line.create({name: '', description: '', manufacturer: manufacturer.id}).fetch();
  flavour = await Flavour.create({name: 'Strawberry', description: 'Вкусная ароматная клубника.', features: {taste: ['клубника']}}).fetch();
  blend = await Blend.create({strength: 3, line: line.id, flavour: flavour.id}).fetch();
  await Component.create({amount: 20, blend: blend.id, mixture: mixture.id});
  manufacturer = await Manufacturer.create({name: 'Nakhla', description: 'Легендарные египтяне. Делают средне-крепкую классику.'}).fetch();
  line = await Line.create({name: 'Mix', description: '', manufacturer: manufacturer.id}).fetch();
  flavour = await Flavour.create({name: 'Flames', description: 'Табак с нотами корицы, аниса и алкоголя.', features: {taste: ['корица', 'анис', 'алкоголь']}}).fetch();
  blend = await Blend.create({strength: 5.5, line: line.id, flavour: flavour.id}).fetch();
  await Component.create({amount: 10, blend: blend.id, mixture: mixture.id});

  user = await User.create({emailAddress: 'marcell89@gmail.com', fullName: 'Марк Моисеев', isSuperAdmin: true, password: await sails.helpers.passwords.hashPassword('pypuavxc')}).fetch();
  mixture = await Mixture.create({name: 'Двойной яблораас', shortDescription: 'Сильное кирпичегонное средство. Лечебный эффект гарантирован.', user: user.id}).fetch();
  manufacturer = await Manufacturer.findOne({name: 'Nakhla'});
  line = await Line.create({name: '', description: '', manufacturer: manufacturer.id}).fetch();
  flavour = await Flavour.create({name: 'Double Apple', description: 'Классическое анисовое двойное яблоко.', features: {taste: ['яблоко', 'анис']}}).fetch();
  blend = await Blend.create({strength: 5.5, line: line.id, flavour: flavour.id}).fetch();
  await Component.create({amount: 50, blend: blend.id, mixture: mixture.id});
  manufacturer = await Manufacturer.create({name: 'Afzal', description: 'Легендарные индусы. Pan Raas знают все.'}).fetch(); line = await Line.create({name: '', description: '', manufacturer: manufacturer.id}).fetch();
  flavour = await Flavour.create({name: 'Pan Raas', description: 'Индийские пряности.', features: {taste: ['пряность', 'специи', 'мята']}}).fetch();
  blend = await Blend.create({strength: 7, line: line.id, flavour: flavour.id}).fetch();
  await Component.create({amount: 20, blend: blend.id, mixture: mixture.id});

  user = await User.create({emailAddress: 'whorecrab@example.com', fullName: 'Шлюховатый отшельник', isSuperAdmin: false, password: await sails.helpers.passwords.hashPassword('pypuavxc')}).fetch();
  mixture = await Mixture.create({name: 'Ядреный мангустин', shortDescription: 'Вся пряная мощь Азии в одном миксе. Вызывает привыкание.', user: user.id}).fetch();

  user = await User.create({emailAddress: 'fatramp@example.com', fullName: 'Вздутый батут', isSuperAdmin: false, password: await sails.helpers.passwords.hashPassword('pypuavxc')}).fetch();
  mixture = await Mixture.create({name: 'Черничная смородина', shortDescription: 'Кисло-ягодная дым-завеса для девочек и слабонервных.', user: user.id}).fetch();

  manufacturer = await Manufacturer.create({name: 'Tangiers', description: 'Легендарные американцы. Производят одни из лучших крепких табаков на планете.'}).fetch();
  line = await Line.create({name: 'Noir', description: 'Оригинальная крепкая линейка.', manufacturer: manufacturer.id}).fetch();
  flavour = await Flavour.create({name: 'Cane Mint', description: 'Сладкая мята.', features: {'taste': ['мята']}}).fetch();
  blend = await Blend.create({strength: 7, line: line.id, flavour: flavour.id}).fetch();

  // Save new bootstrap version
  await sails.helpers.fs.writeJson.with({
    destination: bootstrapLastRunInfoPath,
    json: {
      lastRunVersion: HARD_CODED_DATA_VERSION,
      lastRunAt: Date.now()
    },
    force: true
  })
  .tolerate((err)=>{
    sails.log.warn('For some reason, could not write bootstrap version .json file.  This could be a result of a problem with your configured paths, or, if you are in production, a limitation of your hosting provider related to `pwd`.  As a workaround, try updating app.js to explicitly pass in `appPath: __dirname` instead of relying on `chdir`.  Current sails.config.appPath: `'+sails.config.appPath+'`.  Full error details: '+err.stack+'\n\n(Proceeding anyway this time...)');
  });

};
