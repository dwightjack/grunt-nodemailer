# grunt-nodemailer

> Grunt wrapper for [Nodemailer](https://github.com/andris9/Nodemailer)



## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-nodemailer --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-nodemailer');
```

## The "nodemailer" task

### Overview
In your project's Gruntfile, add a section named `nodemailer` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  nodemailer: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.transport
Type: `Object`
Default value: `null`

A configuration object for an email transport. If left undefined or `null`, transport will default to `'sendmail'` with default options.

The configuration object should have 2 properties:

* `type`: Type of transport. Valid options are: 
  * **SMTP** for using SMTP
  * **SES** for using Amazon SES
  * **Sendmail** for utilizing systems *sendmail* command
* `options`: transport configuration options, see [Nodemailer documentation](https://github.com/andris9/Nodemailer#setting-up-a-transport-method) for more info.

#### options.recipients
Type: `Array`
Default value: `[]`

A collection of recipients. Every item should have 2 properties:

* `name`: Name of the recipient
* `email`: E-mail address of the recipient

#### options.from
Type: `String`
Default value: `'nodemailer <sender@example.com>'`

Sets the _form_ field of the e-mail message.

#### options.subject
Type: `String`
Default value: `''`

E-mail subject.

#### options.html
Type: `String`
Default value: `''`

E-mail body in HTML format.

#### options.text
Type: `String`
Default value: `''`

Email body in plain text format. 

### Using external files

Instead of providing `text` and `html` options you may use external files by setting a `src` property on the sub-task. The first file in the set will be used as the HTML body while the second (if available) as the plain text version. Example:

```js
nodemailer: {
  test: {
    options: { /* ... transport, subject, etc ...*/},
    src: ['email-body.html', 'email-body.txt']
  }
}
```

### Usage Examples

#### E-mail delivery with Gmail SMTP server

This configurations uses Gmail's SMTP service as a transport.

By running the `nodemailer:external` task both HTML and plain text body will be overridden, while by running `nodemailer:external_html` only HTML body will be overridden.

```js
grunt.initConfig({
  nodemailer: {

    options: {
      transport: {
        type: 'SMTP'
        options: {
          service: 'Gmail',
          auth: {
            user: 'john.doe@gmail.com',
            pass: 'password'
          }
        }
      },
      recipients: [
        {
          email: 'jane.doe@gmail.com',
          name: 'Jane Doe'
        }
      ],
      subject: 'A test e-mail'
      text: 'Plain text message'
    },

    inline: {
      html: '<body><h1>HTML custom message</h1></body>',
    },

    external: {
      src: ['email-body.html', 'email-body.txt']
    },

    external_html: {
      src: ['email-body.html']
    }

  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

0.1.2 - Replaced [deprecated](http://gruntjs.com/blog/2013-11-21-grunt-0.4.2-released) reference to `grunt.util._` with `lodash` npm module

0.1.1 - Bugfix

0.1.0 - Initial release
