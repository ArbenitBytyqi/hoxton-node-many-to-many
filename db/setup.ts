import Database from "better-sqlite3";

const db = Database ('./db/data.db', { verbose: console.log })

const applicants = [
    {
      name: 'Applicant 1',
      email: 'applicant1@gmail.com'
    },
    {
      name: 'Applicant 2',
      email: 'applicant2@gmail.com'
    },
    {
      name: 'Applicant 3',
      email: 'applicant3@gmail.com'
    },
    {
      name: 'Applicant 4',
      email: 'applicant4@gmail.com'
    },
    {
      name: 'Applicant 5',
      email: 'applicant5@gmail.com'
    }
  ]

  const interviewers = [
    {
      name: 'Interviewer 1',
      email: 'interviewer1@gmail.com'
    },
    {
      name: 'Interviewer 2',
      email: 'interviewer2@gmail.com'
    },
    {
      name: 'Interviewer 3',
      email: 'interviewer3@gmail.com'
    },
    {
      name: 'Interviewer 4',
      email: 'interviewer4@gmail.com'
    },
    {
      name: 'Interviewer 5',
      email: 'interviewer5@gmail.com'
    }
  ]

  const interviews = [
    {
      applicantId: 1,
      interviewerId: 1,
      date: '27/09/2022',
      place: 'Prishtinë'
    },
    {
      applicantId: 2,
      interviewerId: 1,
      date: '27/09/2022',
      place: 'Prishtinë'
    },
    {
      applicantId: 3,
      interviewerId: 2,
      date: '27/09/2022',
      place: 'Prishtinë'
    },
    {
      applicantId: 3,
      interviewerId: 5,
      date: '27/09/2022',
      place: 'Prishtinë'
    },
    {
      applicantId: 4,
      interviewerId: 3,
      date: '27/09/2022',
      place: 'Prishtinë'
    },
    {
      applicantId: 5,
      interviewerId: 4,
      date: '27/09/2022',
      place: 'Prishtinë'
    },
  ]

// APPLICANTS

const dropApplicantsTable = db.prepare(`
DROP TABLE IF EXISTS applicants;
`)
dropApplicantsTable.run()

const createApplicantsTable = db.prepare(`
CREATE TABLE IF NOT EXISTS applicants(
    id INTEGER,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    PRIMARY KEY (id)
);
`)

createApplicantsTable.run()

const createApplicant = db.prepare(`
INSERT INTO applicants (name, email) VALUES (@name, @email);
`)

for (let applicant of applicants) createApplicant.run(applicant)

// INTERVIEWERS

const dropInterviewersTable = db.prepare(`
DROP TABLE IF EXISTS interviewers;
`)
dropInterviewersTable.run()

const createInterviewersTable= db.prepare(`
CREATE TABLE IF NOT EXISTS interviewers (
    id INTEGER,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    PRIMARY KEY (id)
);
`)
createInterviewersTable.run()

const createInterviewer = db.prepare(`
INSERT INTO interviewers (name, email) VALUES (@name, @email);
`)
for (let interviewer of interviewers) createInterviewer.run(interviewer)

// INTERVIEWS

const dropInterviewsTable = db.prepare(`
DROP TABLE IF EXISTS interviews;
`)

dropInterviewsTable.run()

const createInterviewsTable  = db.prepare(`
CREATE TABLE IF NOT EXISTS interviews (
  id INTEGER,
  applicantId INTEGER,
  interviewerId INTEGER,
  date TEXT NOT NULL,
  place TEXT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (applicantId) REFERENCES applicants(id) ON DELETE CASCADE,
  FOREIGN KEY (interviewerId) REFERENCES interviewers(id) ON DELETE CASCADE
);
`)

createInterviewsTable.run()

const createInterview = db.prepare(`
INSERT INTO interviews (applicantId, interviewerId, date, place) VALUES (@applicantId, @interviewerId, @date, @place);
`)

for (let interview of interviews) createInterview.run(interview)