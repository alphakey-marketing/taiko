# 戰國立志錄 / Sengoku Rising — One-Page Vision

## Worldview Decision
**戰國玄學路線（Sengoku Mysticism）**
架空戰國世界，各大名家不只看武力，也看天命。玩家可走「陰陽師 / 軍師」路線，星象、卦象可影響事件概率與 NPC 決策。

## MVP Main Profession
**武士見習線（Samurai Apprentice）**  
最能呈現核心成長感，且可後期轉職至多條路線。

## Game Selling Point (One Line)
> 在架空戰國世界中，從無名之輩起步，以武藝、智略、人脈與天命改寫自己的人生——走出屬於你的立志傳。

## MVP Required Screens
1. 角色建立畫面（Character Creation）
2. 主 HUD（Main HUD — stats, turn, location info）
3. 城鎮行動畫面（Town Action Screen — location grid + action buttons）
4. 事件對話框（Event Modal — event text + choice buttons）
5. 任務清單（Quest Panel — active/available quests）
6. 角色面板（Character Panel — full stat view）

## 10 Core Quest / Event Ideas
1. 替主家採買軍糧（Commerce check → gold + fame + lord relation）
2. 道場試煉（Martial check → 武藝↑ or injury）
3. 酒館情報蒐集（Charm check → unlock NPC event）
4. 神社祈願（Random luck event → stat buff or omen flag）
5. 主君謁見（Fame gate → identity unlock）
6. 市場討價還價（Commerce check → gold/goods）
7. 同僚糾紛調停（Wisdom + Charm → relation changes both NPCs）
8. 夜間潛行訓練（Martial + Stamina cost → rare item or skill）
9. 導師の試煉（Wisdom check → wisdom↑ + mentor relation）
10. 命運預兆（玄學特殊事件 — random omen flag that gates future events）

## Data Structure Naming Rules
- All IDs: `snake_case` (e.g. `quest_supply_001`, `npc_lord_kato`)
- TypeScript types/interfaces: `PascalCase`
- Enum values: `UPPER_SNAKE_CASE`
- React components: `PascalCase.tsx`
- Store slices: `camelCase` function names
- Data files: `camelCase.ts` in `/src/data/`
- All Japanese text stored as string literals in data files (not hard-coded in components)
