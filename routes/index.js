var express = require('express');
var router = express.Router();
const db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/alumno', (req, res) => {
  const noctrl = req.body.noCtrl;
  const contrasenia = req.body.contrasenia;
  const sql = 'SELECT * FROM itlapp_schema.alumnos WHERE noctrl = $1 AND contrasenia = $2';

  // const creditos = {
  //   '1' : {
  //     horas: 20,
  //     actividad: 'Tutoreo'
  //   },
  //   '2' : {
  //     horas: 20,
  //     actividad: 'MOOCs'
  //   } 
  // };

  // db.query(sql, [19130911, 'David García León', 'lavadora123', 7, 'Ing. En Sistemas Computacionales', null, null, JSON.stringify(creditos)], (err, response) => {
  //   res.send(response.rows[0]);
  // });

  db.query(sql, [noctrl, contrasenia], (err, response) => {
    if(response.rows.length <= 0)
      res.send('');
    else
      res.send(response.rows[0]);
  })
});

router.post('/alumno/crear', (req, res) => {
  const noCtrl = req.body.noctrl;
  const contrasenia = req.body.contrasenia;
  const sqlGet = 'SELECT noctrl, contrasenia FROM itlapp_schema.alumnos WHERE noctrl = $1 AND contrasenia = $2';

  db.query(sqlGet, [noCtrl, contrasenia], (err, response) => {
    if(response.rows.length <= 0) {
      //Promise helll, debí  usar async/await :CC
      const sqlPost = 'INSERT INTO itlapp_schema.alumnos VALUES($1,$2,$3,$4,$5,$6,$7,$8)';
      console.log(req.body.materias);
      db.query(sqlPost, [req.body.noCtrl, req.body.nombre, req.body.contrasenia, req.body.semestre, req.body.carrera, req.body.materias, null, null], (err, response) => {
        res.send({noCtrl,contrasenia});
      });

    } else {
      res.send('').statusCode(500);
    }
  })

});

router.post('/materias', (req, res) => {
  const ids = req.body.ids;
  console.log({ids});
  if(!ids || ids.length <= 0) {
    res.send({status:'error, no ids mandados'}).statusCode(418);
  } else {
    let sql = 'SELECT * FROM itlapp_schema.materias WHERE id IN ';

    let idsString = '(';
    ids.forEach(id => idsString += `\'${id}\',`);
    idsString = idsString.slice(0, -1);
    idsString += ')';
    sql += idsString 

    db.query(sql, [], (err, response) => {
      res.send(response.rows);
    })
  }
});

router.get('/materias', (req, res) => {
  // const sql = 'SELECT * FROM itlapp_schema.alumnos';
  const sql = 'SELECT * FROM itlapp_schema.materias';

  const semestres = {
    1 : {},
    2 : {},
    3 : {},
    4 : {},
    5 : {},
    6 : {},
    7 : {},
    8 : {},
    9 : {}
  };
  db.query(sql, [], (err, response) => {
    const resultado = response.rows.map((materia) => {
      const generalId = materia.id.slice(0,3);
      if (Array.isArray(semestres[materia.semestre][generalId])){
        semestres[materia.semestre][generalId].push(materia);
      } else {
        semestres[materia.semestre][generalId] = [materia];
      }
      
    });
    res.send(semestres);
  })
});

router.get('/horarios', (req, res) => {
  const sql = 'SELECT id, lunes, martes, miercoles, jueves, viernes FROM itlapp_schema.materias';

  db.query(sql, [], (err, response) => {
    const respuesta = response.rows.map((horario) => {
      const horaInicio = horario?.lunes?.slice(0,2) ?? horario?.viernes?.slice(0,2);
      const horaFin = horario?.lunes?.slice(6,8) ?? horario?.viernes?.slice(6,8);

      return {
        id : horario.id,
        horaInicio : Number(horaInicio),
        horaFin: Number(horaFin)
      }
    })

    res.send(respuesta);
  })
});

router.put('/alumno/materiasCursando', (req, res) => {
  let sql = 'UPDATE itlapp_schema.alumnos SET materias_cursando = $1 WHERE noctrl = $2';

  db.query(sql, [req.body.materiasCursando, req.body.noCtrl], (err, response) => {
    if(err) res.send({mensaje: 'upss'}).statusCode(418);
    res.send({mensaje: 'materias_cursaando actualizadas :'});
  })
});

router.put('/alumno/materiasCursadas', (req, res) => {
  let sql = 'UPDATE itlapp_schema.alumnos SET materias_cursadas = $1 WHERE noctrl = $2';

  db.query(sql, [req.body.materiasCursadas, req.body.noCtrl], (err, response) => {
    if(err) res.send({mensaje: 'upss'}).statusCode(418);
    res.send({mensaje: 'materias_cursadas actualizadas :'});
  })
});

router.put('/alumno/creditos', (req, res) => {
  let sql = 'UPDATE itlapp_schema.alumnos SET creditos = $1 WHERE noctrl = $2';

  db.query(sql, [req.body.creditos, req.body.noCtrl], (err, response) => {
    if(err) res.send({mensaje: 'upss'}).statusCode(418);
    res.send({mensaje: 'creditos actualizados :'});
  })
});

module.exports = router;
