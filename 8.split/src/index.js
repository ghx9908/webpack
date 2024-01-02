document.querySelector('#play').addEventListener('click',() => {
  import('./video').then(result => {
      console.log(result.default);
  });
});
