# grunt-multitasker
> Helper functions for manipulating grunt tasks

Grunt tasks are very versatile, but there are a few things missing.
 * The ability to add a multitask with various aliases for targets
 * The ability to set a default target for a multitask

## Getting started
This helper requires Grunt `~0.4.5`
If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the
[Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to
create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and
use Grunt plugins.

To install the helper for use in your gruntfile, use this command:
```shell
npm install grunt-multitasker --save-dev
```

To instantiate the helper inside your gruntfile, simpy use:
```js
var multitasker = require('grunt-multitasker')(grunt);
```

if you'd like the functions to be added to the grunt and grunt.task objects as well, pass true
as an additional argument when instantiating the helper, eg
```js
require('grunt-multitasker')(grunt, true);
```

The helper has several functions to aid in simplifying building tasks

##Note
If you use the `load-grunt-tasks` module, take care to exclude grunt-multitasker from its globbing patterns. By default
it will load tasks for any module matching grunt-*, which causes a warning in the grunt output. The registered tasks
should still work however

#### Creating a simple multitask
A standard grunt task can be registered with an alias, which is simply an array of other tasks
to execute, like so:
```js
grunt.registerTask('myTask', ['otherTask1', 'otherTask2']);
```

Unfortunately, if you want to have several variations on this, you need to either register several
tasks, or you need to create a task with a function that listens to a psuedotarget parameter. The
first solution is fine (and in fact, ideal) when the chains of tasks aren't related. But when they're
related or very similar, it makes sense to group them. Unfortunately writing them in a function
is clunky, like so:
```js
grunt.registerTask('myTask', function(target) {
  if (target === 'target1'){
    grunt.task.run(['otherTask1, otherTask2, otherTask3']);
  }
  else if (target === 'target2') {
    grunt.task.run(['otherTask1, otherTask3']);
  }
  else if (target === 'target3') {
    grunt.task.run(['myTask:target2', 'otherTask4']);
  }
  //etc...
});
```

The multitask makes it easy to group aliases together like targets in a real multitask,
by generating the internal function for you.
you can create a multitask easily like this:
```js
multitasker.registerMultiAliasTask('myTask', {
  target1: ['otherTask1, otherTask2, otherTask3'],
  target2: ['otherTask1, otherTask3'],
  target3: ['myTask:target2', 'otherTask4']
});
```

You can also specify a default target in two ways. You can either give it it's own alias
```js
default: ['otherTask1', 'otherTask2']
```
or you can give it the name of one of the other targets
```js
default: 'target3'
```

#### Setting a default target for a multitask
Multitasks allow you to run a specific target configuration,
but when you don't specify one, they run all of their target configurations,
in the order they were declared. This is often useful, but sometimes certain
targets can be dangerous to run by accident, so being able to specify a
default target would be nice. The helper can do this for you by renaming the task,
and reexposing it with a wrapper of the same name that defaults the target for you.

for example, if your copy task had 4 targets declared
```js
grunt.initConfig({
  copy: {
    t1: {...},
    t2: {...},
    t3: {...},
    t4: {...}
  }
});
```
if you ran `grunt copy`, the effect would be the same as if you had ran
`grunt copy:t1; grunt copy:t2; grunt copy:t3; grunt copy:t4`. If you want to
have a specific set of targets (or a single target) run instead, you'd have to write another task
that aliases the targets. The helper makes this simple

```js
// default to just task t2
multitasker.setDefaultTargets('copy', 't2');

// default to tasks 1 and 3
multitasker.setDefaultTargets('copy', ['t1', 't3']);
```
When renaming the original task, the name will be appended with `-base`, eg `copy-base`. An optional
third argument lets you specify what the task should be renamed to
```js
multitasker.setDefaultTargets('copy', 't2', 'theTaskFormerlyKnownAsCopy');
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
