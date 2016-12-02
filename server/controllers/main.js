let controller = {
  getIndex: (req, res) => {
    res.render('index');
  },
  getTemplate: (req, res) => {
    res.render('templates/' + req.params.template);
  }
}

export default controller;
