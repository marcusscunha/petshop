// helpers 
const { get } = require('mongoose')
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
//outras funcionalidades
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


module.exports = class UserController{

        static async register(req, res){
         const nome = req.body.nome
        const email = req.body.email
         const fone = req.body.fone
         const senha = req.body.senha
        const confirmpassword = req.body.confirmpassword
       
        //validations
        if(!nome){
            res.status(422).json({message:'O nome é obrigatório!'})
        return
        }
        if(!email){
            res.status(422).json({message:'O email é obrigatório!'})
        return
        }if(!fone){
            res.status(422).json({message:'O fone é obrigatório!'})
        return
        }if(!senha){
            res.status(422).json({message:'A senha é obrigatória!'})
        return
        }if(!confirmarsenha){
            res.status(422).json({message:'Confirmar a senha é obrigatória!'})
        return
        }
        if (senha !==confirmarsenha){
        res.status(422).json({message:'A senha e a confirmação de senha precisam ser iguais!'})
         return 
              }
    //check if user exists
    const userExists = await User.findOne({email:email})
    
          if(userExists){
            res.status(422).json({message:'Por favor, utilize outro e-mail!',})
            return 
             }

    //creat a password
    const salt = await bcrypt.genSalt(12)
    const senhaHash = await bcrypt.hash(senha, salt)

    //creat a user 
    const user = new User({
        nome: nome,
        email: email,
        fone: fone,
        senha:senhaHash,
    })

    try {
        const newUser = await user.save()
       await createUserToken(newUser, req, res)
    }
    catch(error){
        res.status(500).json({message: error})
    }
}

static async login(req, res){

    const {email,senha} = req.body

    if(!email){
        res.status(422).json({message:'O email é obrigatório.'})
    return
    }


    if(!senha){
        res.status(422).json({message:'A senha é obrigatório.'})
    return
    }

//check if user exists
const iser = await User.findOne({email:email})
    
if(!user){
  res.status(422).json({message:'Não há usuário com esse e-mail!',})
  return 
   }

//check if senha match with db senha
const checksenha = await bcrypt.compare(senha, user.senha)
if(!checksenha){
res.status(422).json({
    message:'Senha inválida!',
})
return
}

await createUserToken(user,req,res)
}

static async checkUser(req,res){


let currentUser



if(req.header.autorizacao){

const token=getToken(req)
const decoded = jwt.verify(token, 'nossosecret')

currentUser = await User.findById(decoded.id)

currentUser.senha = undefined

} else{
    currentUser = null

}

res.status(200).send(currentUser)

}


static async getUserById(req,res){

const Id=req.params.id

const user = await User.findById(id).select('-senha')

if (!user) {
    res.status(422).json({message:'Usuário não encontrado!'})
    return
}

res.status(200).json({user})

}

static async editUser(req,res){
    const id = req.params.id
   
   
    const {nome, email,fone, senha, confirmarsenha} = req.body
 
//validacoes 



if(!nome){
    res.status(422).json({message:'O nome é obrigatório!'})
return
}
if(user.email!==email&&userExists){
    res.status(422).json({message:'O email é obrigatório!'})
return
}
//checar sem email está em uso
const userExists= await User.findOne({email:email})
if (user.email !== email && userExists) {
    res.status(422).json({message:'Usuário não encontrado!'})
    return
}

}

//if(!fone){
    //res.status(422).json({message:'O fone é obrigatório!'})
//return
//}if(!senha){
  //  res.status(422).json({message:'A senha é obrigatória!'})
//return
//}if(!confirmarsenha){
  //  res.status(422).json({message:'Confirmar a senha é obrigatória!'})
//return
//}
//if (senha !==confirmarsenha){
//res.status(422).json({message:'A senha e a confirmação de senha precisam ser iguais!'})
 //return 
    //  }
    
    //check if user exists 


  //  const user= await User.findById(id)
//if (!user) {
    //res.status(422).json({message:'Usuário não encontrado!'})
   // return
//}

//}

}
