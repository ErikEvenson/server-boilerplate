var
  mongoose = require('mongoose'),
  Organization = mongoose.model('Organization');

var getErrorMessage = function(err) {
  if (err.errors) {
    for (var errName in err.errors) {
      if (err.errors[errName].message) return err.errors[errName].message;
    }
  } else {
    return 'Unknown server error';
  }
};

exports.create = function(req, res) {
  var organization = new Organization(req.body);
  organization.creator = req.user;

  organization.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(organization);
    }
  });
};

exports.delete = function(req, res) {
  var organization = req.organization;

  organization.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(organization);
    }
  });
};

exports.hasAuthorization = function(req, res, next) {
    if (req.organization.creator.id !== req.user.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};

exports.list = function(req, res) {
  Organization
    .find()
    .sort('-created')
    .populate('creator', 'name email')
    .exec(function(err, organizations) {
      if (err) {
        return res.status(400).send({
          message: getErrorMessage(err)
        });
      } else {
        res.json(organizations);
      }
    });
};

exports.organizationByID = function(req, res, next, id) {
  Organization
    .findById(id)
    .populate('creator', 'name email')
    .exec(function(err, organization) {
      if (err) return next(err);
      if (!organization) {
        return next(new Error('Failed to load organization ' + id));
      }

      req.organization = organization;
      next();
    });
};

exports.read = function(req, res) {
  res.json(req.organization);
};

exports.update = function(req, res) {
  var organization = req.organization;

  organization.name = req.body.name;
  organization.email = req.body.email;

  organization.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(organization);
    }
  });
};
