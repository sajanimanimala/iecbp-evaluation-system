const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    try {
        // Hash passwords
        const adminPassword = await bcrypt.hash('Admin123', 10);
        const evaluatorPassword = await bcrypt.hash('Evaluator123', 10);
        const candidatePassword = await bcrypt.hash('Candidate123', 10);

        // Check if users already exist
        const adminExists = await prisma.user.findUnique({
            where: { email: 'admin@gmail.com' },
        });

        const evaluatorExists = await prisma.user.findUnique({
            where: { email: 'evaluator@gmail.com' },
        });

        const candidateExists = await prisma.user.findUnique({
            where: { email: 'candidate@gmail.com' },
        });

        // Create admin user
        if (!adminExists) {
            await prisma.user.create({
                data: {
                    name: 'Admin User',
                    email: 'admin@gmail.com',
                    password: adminPassword,
                    role: 'ADMIN',
                },
            });
            console.log('✓ Admin user created');
        } else {
            console.log('✓ Admin user already exists');
        }

        // Create evaluator user
        if (!evaluatorExists) {
            await prisma.user.create({
                data: {
                    name: 'Evaluator User',
                    email: 'evaluator@gmail.com',
                    password: evaluatorPassword,
                    role: 'EVALUATOR',
                },
            });
            console.log('✓ Evaluator user created');
        } else {
            console.log('✓ Evaluator user already exists');
        }

        // Create candidate user
        if (!candidateExists) {
            await prisma.user.create({
                data: {
                    name: 'Candidate User',
                    email: 'candidate@gmail.com',
                    password: candidatePassword,
                    role: 'CANDIDATE',
                },
            });
            console.log('✓ Candidate user created');
        } else {
            console.log('✓ Candidate user already exists');
        }

        console.log('\n✓ Seed completed successfully');
        console.log('\nTest Users:');
        console.log('  Admin:     admin@gmail.com / Admin123');
        console.log('  Evaluator: evaluator@gmail.com / Evaluator123');
        console.log('  Candidate: candidate@gmail.com / Candidate123');
    } catch (error) {
        console.error('✗ Seed error:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
