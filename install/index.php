<?
use Bitrix\Main\Localization\Loc;

Loc::loadMessages(__FILE__);

if (class_exists("dbogdanoff_alert")) return;

class dbogdanoff_alert extends CModule
{
    public $MODULE_ID = "dbogdanoff.alert";
    public $MODULE_VERSION;
    public $MODULE_VERSION_DATE;
    public $MODULE_NAME;
    public $MODULE_DESCRIPTION;
    public $MODULE_GROUP_RIGHTS = "Y";

    public function __construct()
    {
        $arModuleVersion = array();

        include(__DIR__ . "/version.php");

        $this->MODULE_VERSION = $arModuleVersion["VERSION"];
        $this->MODULE_VERSION_DATE = $arModuleVersion["VERSION_DATE"];

        $this->MODULE_NAME = Loc::getMessage("DBOGDANOFF_DESCRIPTION_MODULE_NAME");
        $this->MODULE_DESCRIPTION = Loc::getMessage("DBOGDANOFF_DESCRIPTION_MODULE_DESCRIPTION");

        $this->PARTNER_NAME = Loc::getMessage("DBOGDANOFF_DESCRIPTION_PARTNER_NAME");
        $this->PARTNER_URI = Loc::getMessage("DBOGDANOFF_DESCRIPTION_PARTNER_URI");
    }

    public function DoInstall()
    {
        $this->InstallEvents();
        $this->InstallFiles();
        \Bitrix\Main\ModuleManager::registerModule($this->MODULE_ID);
    }

    public function DoUninstall()
    {
        $this->UnInstallEvents();
        $this->UnInstallFiles();
        \Bitrix\Main\ModuleManager::unRegisterModule($this->MODULE_ID);
    }

    public function InstallEvents()
    {
        \Bitrix\Main\EventManager::getInstance()->registerEventHandler('main', 'OnPageStart', $this->MODULE_ID);
    }

    public function UnInstallEvents()
    {
        \Bitrix\Main\EventManager::getInstance()->unRegisterEventHandler('main', 'OnPageStart', $this->MODULE_ID);
    }

    public function InstallFiles()
    {
        CopyDirFiles(__DIR__.'/js/', $_SERVER['DOCUMENT_ROOT'].'/bitrix/js/dbogdanoff_alert');
    }

    public function UnInstallFiles()
    {
        DeleteDirFilesEx('/bitrix/js/dbogdanoff_alert');
    }
}
