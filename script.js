// إعدادات JSONbin - بالمفاتيح الخاصة بك
const JSONBIN_API_KEY = "$2a$10$0dtL.rQLuSTEbsUMs86sWOPUssLjIyLGrHzIUX/4vg9/vPMfbIYK.";
const JSONBIN_BIN_ID = "68c0012db0e23b3c068fc76e";
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

// تحميل البيانات عند فتح الصفحة
document.addEventListener('DOMContentLoaded', function() {
    loadData();
});

// دالة لجلب البيانات من JSONbin
async function loadData() {
    try {
        const response = await fetch(JSONBIN_URL, {
            headers: {
                "X-Master-Key": JSONBIN_API_KEY
            }
        });
        
        const data = await response.json();
        displayData(data.record);
    } catch (error) {
        console.error('Error loading data:', error);
        displayData(getDefaultData());
    }
}

// دالة لحفظ البيانات في JSONbin
async function saveData(data) {
    try {
        await fetch(JSONBIN_URL, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": JSONBIN_API_KEY
            },
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// دالة إنشاء رابط جديد
async function createLink() {
    const channelName = document.getElementById('channelName').value;
    const fakeMembers = parseInt(document.getElementById('fakeMembers').value);
    
    // إنشاء رابط واقعي
    const telegramUrl = generateTelegramUrl(channelName);
    
    // جلب البيانات الحالية
    const currentData = await getCurrentData();
    
    // إضافة الرابط الجديد
    currentData.links.push({
        url: telegramUrl,
        channel_name: channelName,
        created_at: new Date().toISOString(),
        click_count: 0,
        fake_members: fakeMembers
    });
    
    // تحديث الإحصائيات
    currentData.stats.total_links++;
    
    // حفظ البيانات
    await saveData(currentData);
    
    // عرض النتيجة
    document.getElementById('result').innerHTML = `
        <div class="success">
            <strong>✅ تم إنشاء الرابط بنجاح:</strong><br>
            <a href="${telegramUrl}" target="_blank">${telegramUrl}</a><br>
            <small>الأعضاء المزيفون: ${fakeMembers.toLocaleString()}</small>
        </div>
    `;
    
    // إعادة تحميل البيانات
    loadData();
}

// دالة إنشاء رابط Telegram
function generateTelegramUrl(channelName) {
    if (channelName) {
        return `t.me/${channelName}`;
    }
    
    const patterns = ["joinchat/{}", "c/{}", "{}"];
    const prefix = patterns[Math.floor(Math.random() * patterns.length)];
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789_';
    let randomPart = '';
    
    for (let i = 0; i < 12; i++) {
        randomPart += chars[Math.floor(Math.random() * chars.length)];
    }
    
    return `t.me/${prefix.replace('{}', randomPart)}`;
}

// دالة لعرض البيانات
function displayData(data) {
    displayStats(data.stats);
    displayLinks(data.links);
}

// عرض الإحصائيات
function displayStats(stats) {
    document.getElementById('stats').innerHTML = `
        <div class="stats-grid">
            <div class="stat">
                <div class="stat-number">${stats.total_links}</div>
                <div class="stat-label">إجمالي الروابط</div>
            </div>
            <div class="stat">
                <div class="stat-number">${stats.total_clicks}</div>
                <div class="stat-label">إجمالي الزيارات</div>
            </div>
        </div>
    `;
}

// عرض الروابط
function displayLinks(links) {
    let html = '<div class="links-container">';
    
    links.slice().reverse().forEach(link => {
        html += `
            <div class="link-item">
                <div class="link-url">
                    <a href="${link.url}" target="_blank">${link.url}</a>
                </div>
                <div class="link-info">
                    <span>الأعضاء: ${link.fake_members.toLocaleString()}</span>
                    <span>الزيارات: ${link.click_count}</span>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    document.getElementById('linksList').innerHTML = html;
}

// بيانات افتراضية
function getDefaultData() {
    return {
        links: [],
        visits: [],
        stats: {
            total_links: 0,
            total_clicks: 0,
            today_clicks: 0,
            active_now: 0
        }
    };
}

// جلب البيانات الحالية
async function getCurrentData() {
    try {
        const response = await fetch(JSONBIN_URL, {
            headers: {
                "X-Master-Key": JSONBIN_API_KEY
            }
        });
        const data = await response.json();
        return data.record;
    } catch (error) {
        return getDefaultData();
    }
}