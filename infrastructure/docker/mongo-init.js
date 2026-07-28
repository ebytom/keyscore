// MongoDB initialization script
// Creates the application database and user

db = db.getSiblingDB('ai-job-copilot');

// Create application user
db.createUser({
  user: 'ajc_user',
  pwd: 'ajc_password',
  roles: [
    {
      role: 'readWrite',
      db: 'ai-job-copilot',
    },
  ],
});

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'createdAt'],
      properties: {
        email: {
          bsonType: 'string',
          description: 'User email address',
        },
        createdAt: {
          bsonType: 'date',
          description: 'Account creation timestamp',
        },
      },
    },
  },
});

db.createCollection('resumes');
db.createCollection('jobs');
db.createCollection('applications');
db.createCollection('interviews');
db.createCollection('coverLetters');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ clerkId: 1 }, { unique: true, sparse: true });
db.users.createIndex({ createdAt: -1 });

db.resumes.createIndex({ userId: 1 });
db.resumes.createIndex({ userId: 1, isPrimary: 1 });
db.resumes.createIndex({ createdAt: -1 });

db.jobs.createIndex({ userId: 1 });
db.jobs.createIndex({ userId: 1, createdAt: -1 });
db.jobs.createIndex({ company: 'text', title: 'text' });

db.applications.createIndex({ userId: 1 });
db.applications.createIndex({ userId: 1, status: 1 });
db.applications.createIndex({ jobId: 1 });
db.applications.createIndex({ createdAt: -1 });

db.interviews.createIndex({ userId: 1 });
db.interviews.createIndex({ userId: 1, status: 1 });
db.interviews.createIndex({ createdAt: -1 });

print('Database initialization complete!');
