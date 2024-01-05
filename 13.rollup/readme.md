##  rollup的执行分成三个阶段

  1. 打包阶段 build hooks是在构建阶段，也就是打包阶段触发的
  const bundle = await rollup(rollupOptions);
  buildEnd
  2. 生成阶段
  await bundle.generate(rollupOptions.output);
  3. 写入阶段
  await bundle.write(rollupOptions.output);
  4. 关闭阶段
  await bundle.close();

## Build-Hooks
https://rollupjs.org/plugin-development/#build-hooks



## Output Generation Hooks
https://rollupjs.org/plugin-development/#output-generation-hooks

## Plugin Context
https://rollupjs.org/plugin-development/#plugin-context
