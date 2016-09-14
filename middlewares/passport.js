const SamlStrategy = require('passport-saml').Strategy;

module.exports = function (passport, config) {

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  passport.use(new SamlStrategy(
    {
      path: config.sso.passport.saml.path,
      entryPoint: config.sso.passport.saml.entryPoint,
      issuer: config.sso.passport.saml.issuer,
      cert: config.sso.passport.saml.cert
    },
    function (profile, done) {
      return done(null,
        {
          // id: profile.uid,
          email: profile.email,
          userName: profile.userName,
          firstName: profile.firstName,
          lastName: profile.lastName,
          fullName: profile.fullName
        });
    })
  );

};
