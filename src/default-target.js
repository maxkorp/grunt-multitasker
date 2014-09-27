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
