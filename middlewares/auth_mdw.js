export function isAuth(req,res,next){
    if(!req.session.auth){
      req.session.retUrl=req.originalUrl;  //luu lai trc khi kick user
      return res.redirect('/account/login');
    }
    next();
  }

  export function isAdmin(req,res,next){
    if(req.session.authUser.permission<4){
        return res.render('403');
    }
    next();
  }

  export function isAuthor(req,res,next){
    if(req.session.authUser.permission<2){
        return res.render('403');
    }
    next();
  }