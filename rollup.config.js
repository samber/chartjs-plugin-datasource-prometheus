import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';

const external = ['assert'];

export default [
	// browser-friendly UMD build
	{
		input: 'src/index.js',
		output: {
			name: 'ChartDatasourcePrometheusPlugin',
			file: pkg.browser,
			format: 'umd',
			globals: {
				'chart.js': 'Chart',
			},
		},
		external: [
			'chart.js',
		],
		plugins: [
			resolve({
				browser: true,
			}),
			commonjs(),
		],
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify
	// `file` and `format` for each target)
	{
		input: 'src/index.js',
		external: [],
		output: [{
				file: pkg.main,
				format: 'cjs',
				globals: {
					'chart.js': 'Chart',
				},
			},
			{
				file: pkg.module,
				format: 'es',
				globals: {
					'chart.js': 'Chart',
				},
			}
		],
		external: [
			'chart.js',
		],
	}
];