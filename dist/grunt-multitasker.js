(function() {
  'use strict';
  module.exports = function(grunt, options) {
    options = options || {};
    var multitasker = {};

    // wraps a multitask and renames it, providing a default target or set of targets
    multitasker.setDefaultTargets = function(task, targets, newName) {
      if (!newName) {
        newName = task + (options.renameSuffix || '-base');
      }

      if (!grunt.task.exists(task)) {
        throw grunt.util.error('task ' + task + ' does not exist');
      }

      if (grunt.util.kindOf('targets') === 'string') {
        targets = [targets];
      }
      else if (grunt.util.kindOf('targets') !== 'array') {
        throw grunt.util.error('invalid type for targets argument');
      }

      targets.forEach(function(target) {
        if (!grunt.config([task, target])) {
          throw grunt.util.error('invalid target ' + target + ' for task ' + task);
        }
      });

      grunt.task.renameTask(task, newName);
      grunt.config(newName, grunt.config(task));
      grunt.registerTask(task, function(requestedTarget) {
        if (!requestedTarget || requestedTarget == 'default') {
          targets.forEach(function(target) {
            grunt.task.run(newName + ':' + target);
          });
        }
        else {
          grunt.task.run(newName + ':' + requestedTarget);
        }
      });
    };

    // registers a task that calls a different alias based on a target
    multitasker.registerMultiAliasTask = function(name, info, tasks) {
      if (!tasks) {
        tasks = info;
        info = 'Custom simple multi task.';
      }

      var targets = Object.keys(tasks);

      //pull out the default task if it's another task, and verify that we have all aliases
      targets.forEach(function(target) {
        if (target === 'default' && grunt.util.kindOf(tasks.default) === 'string') {
          if (!tasks[tasks.default]) {
            throw grunt.util.error('invalid default task');
          }
          // pull out the alias from the referenced target
          tasks.default = tasks[tasks.default];
        }

        if (!Array.isArray(tasks[target])) {
          throw grunt.util.error('invalid alias for target ' + target);
        }
      });

      grunt.registerTask(name, info, function(target) {
        target = target || 'default';

        if (!tasks[target]) {
          throw grunt.util.error('invalid target: ' + target);
        }

        // allows for declaration of a 'default' target to call, rather than calling all of them.
        if (target !== 'default' || tasks.default) {
          grunt.task.run(tasks[target]);
        }
        else {
          targets.forEach(function(target) {
            grunt.task.run(tasks[target]);
          });
        }
      });
    };

    if (options.attachToGrunt) {
      Object.keys(multitasker).forEach(function(key) {
        if (multitasker.hasOwnProperty(key)) {
          grunt.task[key] = multitasker[key];
          grunt[key] = multitasker[key];
        }
      });
    }

    if (options.export !== false) {
      return multitasker;
    }
  };

}());
