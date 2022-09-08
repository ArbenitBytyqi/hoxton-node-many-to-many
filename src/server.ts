import express, { application, response } from 'express'
import cors from 'cors'
import Database from "better-sqlite3";

const db = Database ("./db/data.db", {verbose: console.log})
const app = express()
app.use(cors())
app.use(express.json())
const port = 5000

// APLICANT queries

const getApplicantById = db.prepare(`
SELECT * FROM applicants WHERE id = @id;
`)

const getInterviewsForApplicant = db.prepare(`
SELECT * FROM interviews WHERE applicantId = @applicantId;
`)

const getInterviewersForApplicant = db.prepare(`
SELECT interviewers.* FROM interviewers
JOIN interviews ON interviewers.id = interviews.interviewerId
WHERE interviews.applicantId = @applicantId;
`)

const createApplicant = db.prepare(`
    INSERT INTO applicants (name, email) VALUES (?, ?);
`)

const getApplicants = db.prepare(`
    SELECT * FROM applicants;
`)

const deleteApplicant = db.prepare(`
DELETE FROM applicants WHERE id = ?;
`)

// INTERVIEWER queries

const getInterviewers= db.prepare(`
    SELECT * FROM interviewers;
`)

const createInterviewer = db.prepare(`
    INSERT INTO interviewers (name, email) VALUES (?, ?);
`)

const deleteInterviewer = db.prepare(`
DELETE FROM interviewers WHERE id = ?;
`)

const getInterviewsForInterviewers = db.prepare(`
SELECT * FROM interviews WHERE interviewerId = @interviewerId;
`)

const getInterviewerById = db.prepare(`
SELECT * FROM interviewers WHERE id = @id;
`)

const getApplicantsForInterviewer = db.prepare(`
SELECT applicants.* FROM applicants
JOIN interviews ON applicants.id = interviews.applicantId
WHERE interviews.interviewerId = @interviewerId;
`)


// INTERVIEW queries

const getInterviews = db.prepare(`
    SELECT * FROM interviews;
`)

const createInterview = db.prepare(`
    INSERT INTO interviews (applicantId, interviewerId, date, place) VALUES (?, ?, ?, ?);
`)

const getInterviewsById = db.prepare(`
SELECT * FROM interviews WHERE id = ?;
`)

const deleteInterview = db.prepare(`
DELETE FROM interviews WHERE id = ?;
`)

// APLICANT

app.get('/applicants', (req, res) => {
    const applicants = getApplicants.all()
    res.send(applicants)
})

app.get('/applicants/:id', (req, res) =>{
    const applicant = getApplicantById.get(req.params)

    if(applicant){
        applicant.interviews = getInterviewsForApplicant.all({ applicantId: applicant.id })
        applicant.interviewers =  getInterviewersForApplicant.all({ applicantId: applicant.id })
        res.send(applicant)
    } else{
        res.status(404).send({error: 'Applicant not found'})
    }
})

app.post('/applicants', (req, res) => {
    const name = req.body.name
    const email = req.body.email

      let errors: string[] = []
      
      if (typeof name !== 'string') {
          errors.push('Name not given!')
        }
     
      if(typeof email  !=='string') {
          errors.push('Email not given')
      }
      
      if (errors.length > 0){
        res.status(400).send({ errors })
    }else{
        const info = createApplicant.run(name, email)
        const applicant = getApplicantById.get(info.lastInsertRowid)
        res.send(applicant)
    }
})

app.delete('/applicants/:id', (req, res) => {
    const id = Number(req.params.id)
    const info = deleteApplicant.run(id)

    if(info.changes){
        res.send({message: 'Applicant successfully deleted.' })
    } else {
        res.status(404).send({error: 'Applicant not found 😒.' })
    }
})

// INTERVIEWER

app.get('/interviewers', (req, res) => {
    const interviewers = getInterviewers.all()
    res.send(interviewers)
})

app.get('/interviewers/:id', (req, res) =>{
    const interviewer = getInterviewerById.get(req.params)

    if(interviewer){
        interviewer.interviews = getInterviewsForInterviewers.all({ interviewerId: interviewer.id })
        interviewer.applicants =  getApplicantsForInterviewer.all({ interviewerId: interviewer.id })
        res.send(interviewer)
    } else{
        res.status(404).send({error: 'Interviewer not found'})
    }
})

app.post('/interviewers', (req, res) => {
    const name = req.body.name
    const email = req.body.email

      let errors: string[] = []
      
      if (typeof name !== 'string') {
          errors.push('Name not given!')
        }
     
      if(typeof email  !=='string') {
          errors.push('Email not given')
      }
      
      if (errors.length > 0){
        res.status(400).send({ errors })
    }else{
        const info = createInterviewer.run(name, email)
        const interviewer = getApplicantById.get(info.lastInsertRowid)
        res.send(interviewer)
    }
})

app.delete('/interviewers/:id', (req, res) => {
    const id = Number(req.params.id)
    const info = deleteInterviewer.run(id)

    if(info.changes){
        res.send({message: 'Interviewer successfully deleted.' })
    } else {
        res.status(404).send({error: 'Interviewer not found 😒.' })
    }
})

// INTERVIEWS

app.get('/interviews', (req, res) => {
    const interviews = getInterviews.all()
    res.send(interviews)
})

app.post('/interviews', (req, res) => {
    const applicantId = req.body.applicantId
    const interviewerId = req.body.interviewerId
    const date = req.body.date
    const place = req.body.place
      let errors: string[] = []

      if (typeof applicantId !== 'number') {
          errors.push('Applicant Id not given')
        }
      if(typeof interviewerId  !=='number') {
          errors.push('Interviewer Id not given')
      }
      if(typeof date  !=='string') {
          errors.push('Date not given')
      }
      if(typeof place  !=='string') {
          errors.push('Place nor given')
      }

      if (errors.length > 0){
        res.status(400).send({ errors })
    }else{
          const interviewInfo = createInterview.run(applicantId, interviewerId, date, place)
        const newInterviews = getInterviewsById.get(interviewInfo.lastInsertRowid)
        res.send(newInterviews)
        }
})

app.delete('/interviews/:id', (req, res) => {
    const id = Number(req.params.id)
    const info = deleteInterview.run(id)

    if(info.changes){
        res.send({message: 'Interview successfully deleted.' })
    } else {
        res.status(404).send({error: 'Interviewer not found 😒.' })
    }
})

app.listen(port, () => {
    console.log (`App running on : http://localhost:${port} `)
})
