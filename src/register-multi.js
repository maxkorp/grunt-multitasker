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
        throw grunt.util.error ('invalid default task');
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
