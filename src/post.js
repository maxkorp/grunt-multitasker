    if (options.attachToGrunt) {
      Object.keys(multitasker).forEach(function(key){
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
