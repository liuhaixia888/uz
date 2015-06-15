var uz = root.uz = module.exports = require('fis');

uz.cli.name = 'uz';
uz.cli.info = uz.util.readJSON(__dirname + '/package.json');
uz.require.prefixes = ['uz', 'fis'];

uz.config.merge({
	images: '/images',
	css: '/css',
	js: '/js',
	pack:{
		// 打包不依赖模块加载的库文件
		'/js/pkg/lib.js': /\/js\/lib\/(.*)\.(js)$/i,
		// 打包纯js模块
		'/js/pkg/mods.js': /\/modules\/(.*)\.(js)$/i,
		// 打包widget模拟数据
		'/js/pkg/json.js': /\/(widget|pages)\/(.*\.(?:json.js))/i,
		// 打包页面和widget模块js文件
		'/js/pkg/page.js': /\/(widget|pages)\/(.*)\.(js)$/i,
		// 打包模板文件
		'/js/pkg/templates.js': /\/(widget|pages)\/(.*)\.(jade)$/i,
		// 打包css文件
		'/css/home.css': ['**.less']
	},
	project: {
		exclude: ['node_modules/**', 'dest/**', 'dist/**', '_build/**'],
		watch: {
			exclude: ['node_modules', /dest/]
		}
	},
	modules: {
		parser: {
			less: ['less-import', 'less'],
			jade: ['jade-runtime']
		},
		postprocessor: {
			js: "jswrapper, require-async",
			html: "require-async"
		},
		postpackager: ['autoload', 'simple', 'replace'],
		spriter: 'csssprites',
		lint: {
			js: 'jshint'
		}
	},
	settings: {
		parser: {
			jade: {
				pretty: true
			},
			"replace-path": {
				replace: {
					"com": "mods"
				}
			},
			"less-import": {
				file: '/src/css/lib/base.less'
			},
			"jade-runtime": {
				pretty: true
			}
		},
		optimizer : {
			'clean-css' : {
				keepBreaks : true
			},
			'png-compressor' : {
				type : 'pngquant'
			}			
		},
		spriter: {
			csssprites: {
				scale: 0.5,
				margin: 20
			}
		},
		postprocessor: {
			jswrapper: {
				type: 'amd'
			}
		},
		postpackager: {
			replace: {
				'/css/home.css': {
					'url\\(/images/|gi': 'url(../images/',
					'url\\(\'/images/|gi': 'url(\'../images/'
				}
			}
		},
		lint: {
			jshint: {
				camelcase: true,
				curly: true,
				eqeqeq: true,
				forin: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				noempty: true,
				node: true
			}
		}
	},
	roadmap: {
		ext: {
			less: 'css'
		},
		path: [
			{
				reg: 'uzconfig.js',
				release: false
			},
			{
				// 涉及less合并先后顺序
				// 不处理css/lib|inc下的less文件，由common.less或home.less使用import语法加载
				reg: /\/css\/(lib|inc)\/(.*)\.(less)$/i,
				release: false
			},
			{
	            //一级同名组件，可以引用短路径，比如modules/jquery/juqery.js
	            //直接引用为var $ = require('jquery');
	            reg: /\/modules\/([^\/]+)\/\1\.(js)$/i,
	            //是组件化的，会被jswrapper包装
	            isMod: true,
	            //id为文件夹名
	            id: '$1',
	            // release: '${statics}/$&'
			},
			{
	            //modules目录下的其他脚本文件
	            reg: /\/modules\/(.*)\.(js)$/i,
	            //是组件化的，会被jswrapper包装
	            isMod: true,
	            //id是去掉modules和.js后缀中间的部分
	            id: '$1',
			},
			// {
			// 	// 过滤mock的模拟规则
			// 	reg: /\/widget\/(.*\.(?:json.js))/i,
			// 	release: false
			// },
			{
	            //一级同名组件，可以引用短路径，比如modules/jquery/juqery.js
	            //直接引用为var $ = require('jquery');
	            reg: /\/widget\/([^\/]+)\/\1\.(js)$/i,
	            //是组件化的，会被jswrapper包装
	            isMod: true,
	            //id为文件夹名
	            id: '$1',
			},
			{
				// widget目录下的其他脚本文件
				reg: /\/widget\/(.*)\.(js)$/i,
				// 是组件化的，会被jswrapper包装
				isMod: true,
				// id是去掉widget和.js后缀中间的部分
				id: '$1',
			},
			{
	            //一级同名组件，可以引用短路径，比如modules/jquery/juqery.js
	            //直接引用为var $ = require('jquery');
	            reg: /\/pages\/([^\/]+)\/\1\.(js)$/i,
	            //是组件化的，会被jswrapper包装
	            isMod: true,
	            //id为文件夹名
	            id: 'pages/$1',
			},
			{
				// pages目录下的其他脚本文件
				reg: /\/pages\/(.*)\.(js)$/i,
				// 是组件化的，会被jswrapper包装
				isMod: true,
				// id是去掉pages和.js后缀中间的部分
				id: 'pages/$1',
			},
			{
				// widget目录下的其他脚本文件
				reg: /\/widget\/(.*)\.(jade)$/i,
				// 是组件化的，会被jswrapper包装
				isJsLike: true,
				isMod: true,
				// id是去掉widget和.js后缀中间的部分
				id: '$1',
			},
			{
				// pages目录下的其他脚本文件
				reg: /\/pages\/(.*)\.(jade)$/i,
				// 是组件化的，会被jswrapper包装
				isJsLike: true,
				isMod: true,
				// id是去掉pages和.js后缀中间的部分
				id: 'pages/$1',
			},
			{
				// widget目录下的静态资源
				reg: /\/widget\/(.*\.(?:png|jpg|jpeg))/i,
				id: '$&',
				release: '${images}/$1'
			},
			{
				// widget目录下的静态资源
				reg: /\/widget\/(.*\.(?:less|html|jade))/i,
			},
			{
				// pages目录下的静态资源
				reg: /\/pages\/(.*\.(?:less|html|jade))/i,
			},
			{
				reg: /^\/src\/(.*)/i,
				release: '/$1',
				// useStandard: false
			},
			{
				reg: /^\/dest\//i,
				release: false
			},
			{
				reg: 'readme.md',
				release: false
			}
		]
	}
});