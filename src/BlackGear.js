"use strict";
/*
 * author: Lukewarmpuding,
 * updater: ShadowXtrex,
 * Original idea: JustNU,
 * Version: 361.0.0,
 * Compatible with AKI 3.6.1,
 * Date: 03/08/2022,
*/
const LogTextColor_1 = require("C:/snapshot/project/obj/models/spt/logging/LogTextColor");
const LogBackgroundColor_1 = require("C:/snapshot/project/obj/models/spt/logging/LogBackgroundColor");
class Mod
{
	constructor()
	{
		this.modinfo = require("../package.json");
		this.path = require('path');
        this.modName = this.path.basename(this.path.dirname(__dirname.split('/').pop()));
	}
	preAkiLoad(container)
	{
		this.logger = container.resolve("WinstonLogger");
		this.logger.logWithColor(`Loading: ${this.modinfo.author}-AdditionalGear Black Module v${this.modinfo.version}`, LogTextColor_1.LogTextColor.CYAN, LogBackgroundColor_1.LogBackgroundColor.BLACK);
        return;
	}
	
	postDBLoad(container) 
	{
		// Constants
		const logger = container.resolve("WinstonLogger");
		const database = container.resolve("DatabaseServer").getTables();
		const jsonUtil = container.resolve("JsonUtil");
		const core = container.resolve("JustNUCore");
		const VFS = container.resolve("VFS");
		const modLoader = container.resolve("PreAkiModLoader");
		const modDb = `user/mods/zAdditionalGear-BlackModule/db/`;
		const config = require("../config/config.json");
		const itemConfig = require("../config/itemConfig.json");
		const itemData = require("../db/items/itemData.json");
		const enLocale = require(`../db/locales/en.json`);
		const modPath = modLoader.getModPath("AdditionalGear - Black Module");
		
		//add retextures
		for (const categoryId in itemConfig)
        {
			for (const itemId in itemConfig[categoryId])
            {
				// handle locale
				for (const localeID in database.locales.global)
                {
					// en placeholder
					if (enLocale[itemId])
                    {
						for (const localeItemEntry in enLocale[itemId])
                        {
							database.locales.global[localeID][`${itemId} ${localeItemEntry}`] = enLocale[itemId][localeItemEntry];
						}
					}
					// actual locale
					if (VFS.exists(`${modPath}locales/${localeID}.json`) && localeID != "en")
                    {
						const actualLocale = require(`../locales/${localeID}.json`);
						if (actualLocale[itemId])
                        {
							for (const localeItemEntry in actualLocale[itemId])
                            {
								database.locales.global[localeID][`${itemId} ${localeItemEntry}`] = actualLocale[itemId][localeItemEntry];
							}
						}
					}
				}
				// add item retexture that is 1:1 to original item
				if (itemConfig[categoryId][itemId])
                {
					core.addItemRetexture(itemId, itemData[itemId].BaseItemID, itemData[itemId].BundlePath, config.EnableTradeOffers, config.AddToBots, itemData[itemId].LootWeigthMult);
				}
			}
		}
		this.logger.logWithColor(`[${this.modinfo.name}] Items Cached Successfully`, LogTextColor_1.LogTextColor.GREEN, LogBackgroundColor_1.LogBackgroundColor.BLACK);
        //this.logger.log(`[${this.modinfo.name}] Bug reports: Write it in the Support thread.`, LogTextColor_1.LogTextColor.CYAN, LogBackgroundColor_1.LogBackgroundColor.BLACK);
    }
}

module.exports = { mod: new Mod() }