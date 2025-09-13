// js/ui/week-loader.js - Dinamik hafta içeriği yükleme

class WeekLoader {
    static async loadWeekData(weekNumber, theme) {
        try {
            const weekString = weekNumber.toString().padStart(2, '0');
            const response = await fetch(`data/${theme}/week${weekString}.json`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const weekData = await response.json();
            return this.validateAndEnrichData(weekData, weekNumber, theme);
            
        } catch (error) {
            console.warn(`Failed to load week ${weekNumber} for theme ${theme}:`, error);
            return this.getFallbackData(weekNumber, theme);
        }
    }

    static validateAndEnrichData(weekData, weekNumber, theme) {
        // Ensure all required fields exist
        const enriched = {
            week: weekNumber,
            title: weekData.title || `Hafta ${weekNumber}`,
            description: weekData.description || "Açıklama yükleniyor...",
            duration: weekData.duration || "90 dakika",
            difficulty: weekData.difficulty || "Orta",
            objectives: weekData.objectives || [],
            codeExamples: weekData.codeExamples || [],
            exercises: weekData.exercises || [],
            files: weekData.files || [],
            links: weekData.links || [],
            animations: weekData.animations || []
        };

        // If no animations provided, add default
        if (enriched.animations.length === 0) {
            enriched.animations = this.getDefaultAnimations(weekNumber, theme);
        }

        // Ensure at least one code example exists
        if (enriched.codeExamples.length === 0) {
            enriched.codeExamples = this.getDefaultCodeExample(weekNumber, theme);
        }

        return enriched;
    }

    static getDefaultAnimations(weekNumber, theme) {
        const animations = [];

        switch (weekNumber) {
            case 1:
                animations.push({
                    type: "simple",
                    title: "Program Akışı",
                    description: "C programının nasıl çalıştığını gösterir",
                    config: { maxSteps: 3 }
                });
                break;

            case 2:
                animations.push(
                    {
                        type: "variables",
                        title: "Değişken Tanımlama",
                        description: "Değişkenlerin bellekte nasıl oluşturulduğunu gösterir",
                        config: { variables: ["int", "float", "char"] }
                    },
                    {
                        type: "memory-view",
                        title: "Bellek Görünümü",
                        description: "Değişkenlerin bellek adresleri",
                        config: { showAddresses: true }
                    }
                );
                break;

            case 3:
                animations.push(
                    {
                        type: "conditional",
                        title: "Koşul Kontrolü",
                        description: "If-else yapısının nasıl çalıştığını gösterir",
                        config: { condition: "sayi > 0" }
                    },
                    {
                        type: "flowchart",
                        title: "Karar Ağacı",
                        description: "Koşullu ifadelerin akış diyagramı",
                        config: { showPaths: true }
                    }
                );
                break;

            case 4:
                animations.push(
                    {
                        type: "for-loop",
                        title: "For Döngüsü Akışı",
                        description: "For döngüsünün adım adım çalışması",
                        config: { maxIterations: 5, showNodes: ["init", "cond", "body", "inc"] }
                    },
                    {
                        type: "memory-view",
                        title: "Döngü Değişkeni",
                        description: "i değişkeninin bellekte değişimi",
                        config: { trackVariable: "i" }
                    },
                    {
                        type: "execution-trace",
                        title: "Kod İzleme",
                        description: "Kodun satır satır çalışması",
                        config: { highlightLines: true }
                    }
                );
                break;

            case 5:
                animations.push(
                    {
                        type: "while-loop",
                        title: "While Döngüsü",
                        description: "While döngüsünün çalışma prensibi",
                        config: { maxIterations: 5 }
                    },
                    {
                        type: "loop-comparison",
                        title: "For vs While",
                        description: "İki döngü türünün karşılaştırması",
                        config: { showBoth: true }
                    }
                );
                break;

            case 6:
                animations.push(
                    {
                        type: "function-call",
                        title: "Fonksiyon Çağırma",
                        description: "Fonksiyon çağırma mekanizması",
                        config: { showCallStack: true }
                    },
                    {
                        type: "parameter-passing",
                        title: "Parametre Geçişi",
                        description: "Parametrelerin nasıl geçirildiği",
                        config: { showMemory: true }
                    }
                );
                break;

            case 7:
                animations.push(
                    {
                        type: "array-memory",
                        title: "Dizi Bellek Düzeni",
                        description: "Dizilerin bellekte nasıl saklandığı",
                        config: { arraySize: 5 }
                    },
                    {
                        type: "array-access",
                        title: "Dizi Erişimi",
                        description: "Dizi elemanlarına erişim süreci",
                        config: { showIndexing: true }
                    }
                );
                break;

            default:
                animations.push({
                    type: "simple",
                    title: "Genel Animasyon",
                    description: "Bu hafta için animasyon",
                    config: { maxSteps: 1 }
                });
        }

        return animations;
    }

    static getDefaultCodeExample(weekNumber, theme) {
        switch (weekNumber) {
            case 1:
                return [{
                    title: "Merhaba Dünya",
                    code: theme === 'lotr' 
                        ? `#include <stdio.h>\nint main() {\n    printf("Orta Dünya'ya hoş geldiniz! Frodo yola çıktı...\\n");\n    return 0;\n}`
                        : `#include <stdio.h>\nint main() {\n    printf("Merhaba Dünya!\\n");\n    return 0;\n}`,
                    explanation: "İlk C programınız"
                }];

            case 2:
                return [{
                    title: "Değişken Tanımlama",
                    code: theme === 'lotr'
                        ? `#include <stdio.h>\nint main() {\n    int frodo_age = 33;\n    float ring_weight = 0.05;\n    char ring_owner = 'F';\n    printf("Frodo %d yaşında, yüzüğün ağırlığı %.2f kg.\\n", frodo_age, ring_weight);\n    return 0;\n}`
                        : `#include <stdio.h>\nint main() {\n    int sayi = 10;\n    float ondalik = 3.14;\n    char karakter = 'A';\n    printf("Sayı: %d, Ondalık: %.2f, Karakter: %c\\n", sayi, ondalik, karakter);\n    return 0;\n}`,
                    explanation: "Temel veri tipleri"
                }];

            case 3:
                return [{
                    title: "Koşullu İfade",
                    code: theme === 'lotr'
                        ? `#include <stdio.h>\nint main() {\n    char owner = 'F';\n    if (owner == 'F') {\n        printf("Yüzük Frodo'da.\\n");\n    } else {\n        printf("Yüzük başkasına geçti!\\n");\n    }\n    return 0;\n}`
                        : `#include <stdio.h>\nint main() {\n    int sayi = 5;\n    if (sayi > 0) {\n        printf("Pozitif sayı\\n");\n    } else {\n        printf("Negatif veya sıfır\\n");\n    }\n    return 0;\n}`,
                    explanation: "If-else yapısı"
                }];

            case 4:
                return [{
                    title: "For Döngüsü",
                    code: theme === 'lotr'
                        ? `#include <stdio.h>\nint main() {\n    for (int day = 1; day <= 5; day++) {\n        printf("%d. gün: Yüzük Kardeşliği ilerliyor...\\n", day);\n    }\n    return 0;\n}`
                        : `#include <stdio.h>\nint main() {\n    for (int i = 0; i < 5; i++) {\n        printf("i değeri: %d\\n", i);\n    }\n    return 0;\n}`,
                    explanation: "Temel for döngüsü"
                }];

            case 5:
                return [{
                    title: "While Döngüsü",
                    code: theme === 'lotr'
                        ? `#include <stdio.h>\nint main() {\n    int depth = 0;\n    while (depth < 5) {\n        printf("Derinlik %d: Karanlıkta ilerliyoruz...\\n", depth);\n        depth++;\n    }\n    printf("Sonunda çıkışı bulduk!\\n");\n    return 0;\n}`
                        : `#include <stdio.h>\nint main() {\n    int i = 0;\n    while (i < 5) {\n        printf("i değeri: %d\\n", i);\n        i++;\n    }\n    return 0;\n}`,
                    explanation: "Temel while döngüsü"
                }];

            default:
                return [{
                    title: "Örnek Kod",
                    code: `#include <stdio.h>\nint main() {\n    printf("Bu hafta için örnek kod\\n");\n    return 0;\n}`,
                    explanation: "Genel örnek"
                }];
        }
    }

    static getFallbackData(weekNumber, theme) {
        console.log(`Using fallback data for week ${weekNumber}, theme: ${theme}`);
        
        return {
            week: weekNumber,
            title: `Hafta ${weekNumber}: ${theme === 'lotr' ? 'Orta Dünya Macerası' : 'C Programlama'}`,
            description: "Bu hafta için içerik yükleniyor...",
            duration: "90 dakika",
            difficulty: "Orta",
            objectives: [
                "Temel kavramları öğrenmek",
                "Kod örneklerini incelemek",
                "Uygulamalı çalışma yapmak"
            ],
            codeExamples: this.getDefaultCodeExample(weekNumber, theme),
            exercises: [
                {
                    title: "Pratik Alıştırma",
                    prompt: "Verilen kodu çalıştırın ve sonuçları gözlemleyin",
                    hint: "Kodun her satırını dikkatlice inceleyin",
                    solution: "// Çözüm yükleniyor..."
                }
            ],
            files: [
                {
                    name: `week${weekNumber}_example.c`,
                    content: this.getDefaultCodeExample(weekNumber, theme)[0].code,
                    description: "Bu hafta için örnek C dosyası"
                }
            ],
            links: [
                {
                    title: "C Programlama Referansı",
                    url: "https://cppreference.com",
                    description: "Resmi C dili dokümantasyonu"
                }
            ],
            animations: this.getDefaultAnimations(weekNumber, theme)
        };
    }

    static async preloadWeek(weekNumber, theme) {
        try {
            const data = await this.loadWeekData(weekNumber, theme);
            this.cache = this.cache || {};
            this.cache[`${theme}-${weekNumber}`] = data;
            return data;
        } catch (error) {
            console.warn(`Failed to preload week ${weekNumber}:`, error);
            return null;
        }
    }

    static getFromCache(weekNumber, theme) {
        const key = `${theme}-${weekNumber}`;
        return this.cache && this.cache[key] ? this.cache[key] : null;
    }

    static async loadMultipleWeeks(weekNumbers, theme) {
        const promises = weekNumbers.map(week => this.preloadWeek(week, theme));
        const results = await Promise.allSettled(promises);
        
        return results.map((result, index) => ({
            week: weekNumbers[index],
            data: result.status === 'fulfilled' ? result.value : null,
            error: result.status === 'rejected' ? result.reason : null
        }));
    }
}