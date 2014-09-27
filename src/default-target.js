// wraps a multitask and renames it, providing a default target or set of targets
multitasker.setDefaultTargets = function(task, targets, renameTo) {
  if (renameTo === null) {
    renameTo = taskName + (options.renameSuffix || '-base');
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

  grunt.task.renameTask(task, renameTo);
  grunt.registerTask(task, function(requestedTarget) {
    if (!requestedTarget || requestedTarget == 'default') {
      targets.forEach(function(target) {
        grunt.task.run(rename + ':' + target);
      });
    }
    else {
      grunt.task.run(rename + ':' + requestedTarget);
    }
  });
};
