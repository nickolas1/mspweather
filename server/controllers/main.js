let controller = {
  getIndex: (req, res) => {
    res.render('index');
  },
  getTemplate: (req, res) => {
    console.log(req.params)
    res.render('templates/' + req.params.template);
  }
}

export default controller;
