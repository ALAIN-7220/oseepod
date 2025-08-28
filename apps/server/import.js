import fs from 'fs';
import path from 'path';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

// Import schema
import { podcast } from './src/db/index.js';
const { categories, pastors, episodes } = podcast;

// Database connection
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/oseepod';
const client = new Client({ connectionString });
await client.connect();
const db = drizzle(client);

// Podcast directory path
const podcastDir = '../web/public/podcast';

// Helper function to get audio duration (approximation based on file size)
function getAudioDuration(filePath) {
    try {
        const stats = fs.statSync(filePath);
        const fileSizeInBytes = stats.size;
        // Rough approximation: WAV files ~10MB per minute of audio
        const durationInMinutes = Math.round(fileSizeInBytes / (10 * 1024 * 1024));
        return Math.max(durationInMinutes, 1) * 60; // Convert to seconds, minimum 1 minute
    } catch (error) {
        console.error(`Error getting duration for ${filePath}:`, error);
        return 2700; // Default 45 minutes in seconds
    }
}

// Helper function to parse filename and extract metadata
function parseFilename(filename) {
    // Remove extension
    const nameWithoutExt = path.parse(filename).name;
    
    // Parse different filename patterns
    if (nameWithoutExt.match(/^\d{6}_\d{4}$/)) {
        // Pattern like "231029_0260" - date_episode
        const [dateStr, episodeNum] = nameWithoutExt.split('_');
        const year = 2000 + parseInt(dateStr.substring(0, 2));
        const month = parseInt(dateStr.substring(2, 4));
        const day = parseInt(dateStr.substring(4, 6));
        
        return {
            title: `Prédication du ${day}/${month}/${year}`,
            description: `Épisode ${episodeNum} - Enseignement spirituel du ${day}/${month}/${year}`,
            publishedAt: new Date(year, month - 1, day),
            episodeNumber: parseInt(episodeNum)
        };
    } else if (nameWithoutExt === 'diverses-langues') {
        return {
            title: 'Prédication en Diverses Langues',
            description: 'Un enseignement spirituel multiculturel avec des messages en différentes langues',
            publishedAt: new Date(2021, 1, 17), // Based on file date
            episodeNumber: 1
        };
    } else {
        // Generic fallback
        return {
            title: nameWithoutExt.replace(/-/g, ' ').replace(/_/g, ' '),
            description: `Enseignement spirituel - ${nameWithoutExt}`,
            publishedAt: new Date(),
            episodeNumber: Math.floor(Math.random() * 1000) + 1
        };
    }
}

async function importPodcasts() {
    try {
        console.log('🎧 Starting podcast import process...');
        
        // Create default categories
        const defaultCategories = [
            { name: 'Prédication', slug: 'predication', description: 'Messages de prédication dominicale', color: '#3B82F6' },
            { name: 'Enseignement', slug: 'enseignement', description: 'Études bibliques approfondies', color: '#10B981' },
            { name: 'Témoignage', slug: 'témoignage', description: 'Témoignages de foi et de guérison', color: '#F59E0B' },
            { name: 'Louange', slug: 'louange', description: 'Cantiques et chants de louange', color: '#EF4444' }
        ];

        console.log('📂 Creating categories...');
        const insertedCategories = await db.insert(categories).values(defaultCategories).returning();
        console.log(`✅ Created ${insertedCategories.length} categories`);

        // Create default pastors
        const defaultPastors = [
            { 
                name: 'Pasteur Jean-Marie Kouame',
                slug: 'jean-marie-kouame',
                bio: 'Pasteur principal avec plus de 20 ans d\'expérience dans l\'enseignement biblique'
            },
            { 
                name: 'Pasteure Sarah Konan',
                slug: 'sarah-konan', 
                bio: 'Spécialiste des études bibliques et de l\'accompagnement spirituel'
            },
            { 
                name: 'Pasteur David Yao',
                slug: 'david-yao',
                bio: 'Évangéliste et prédicateur international'
            },
            { 
                name: 'Équipe Pastorale',
                slug: 'equipe-pastorale',
                bio: 'Messages collectifs de l\'équipe pastorale'
            }
        ];

        console.log('👨‍💼 Creating pastors...');
        const insertedPastors = await db.insert(pastors).values(defaultPastors).returning();
        console.log(`✅ Created ${insertedPastors.length} pastors`);

        // Read podcast files
        const podcastFullPath = path.resolve(__dirname, podcastDir);
        const files = fs.readdirSync(podcastFullPath)
            .filter(file => file.endsWith('.wav') || file.endsWith('.mp3'));

        console.log(`🎵 Found ${files.length} audio files to import`);

        const episodesData = [];
        
        files.forEach((file, index) => {
            const filePath = path.join(podcastFullPath, file);
            const metadata = parseFilename(file);
            const duration = getAudioDuration(filePath);
            
            // Generate slug from title
            const slug = metadata.title.toLowerCase()
                .replace(/[àáâäãå]/g, 'a')
                .replace(/[èéêë]/g, 'e')
                .replace(/[ìíîï]/g, 'i')
                .replace(/[òóôöõ]/g, 'o')
                .replace(/[ùúûü]/g, 'u')
                .replace(/[ç]/g, 'c')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '')
                .substring(0, 50);
            
            // Assign to random category and pastor
            const randomCategory = insertedCategories[Math.floor(Math.random() * insertedCategories.length)];
            const randomPastor = insertedPastors[Math.floor(Math.random() * insertedPastors.length)];
            
            episodesData.push({
                title: metadata.title,
                slug: slug,
                description: metadata.description,
                audioUrl: `/podcast/${file}`, // URL to serve the file
                duration: duration,
                publishedAt: metadata.publishedAt,
                isPublished: true,
                categoryId: randomCategory.id,
                pastorId: randomPastor.id,
                playCount: Math.floor(Math.random() * 1000) + 50, // Random play count
                isFeatured: index < 3 // First 3 episodes are featured
            });
        });

        console.log('💾 Inserting episodes into database...');
        const insertedEpisodes = await db.insert(episodes).values(episodesData).returning();
        console.log(`✅ Created ${insertedEpisodes.length} episodes`);

        console.log('\n📊 Import Summary:');
        console.log(`Categories: ${insertedCategories.length}`);
        console.log(`Pastors: ${insertedPastors.length}`);
        console.log(`Episodes: ${insertedEpisodes.length}`);
        
        console.log('\n🎧 Episodes imported:');
        insertedEpisodes.forEach((episode, index) => {
            console.log(`${index + 1}. ${episode.title} (${Math.floor(episode.duration / 60)}min)`);
        });

        console.log('\n✅ Import completed successfully!');
        
    } catch (error) {
        console.error('❌ Error during import:', error);
    } finally {
        await client.end();
    }
}

// Run the import
importPodcasts();