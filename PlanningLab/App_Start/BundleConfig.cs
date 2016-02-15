using System.IO;
using System.Web;
using System.Web.Optimization;

namespace PlanningLab
{
    public class BundleConfig
    {
        public static string AppDir = "app";
        public static void RegisterBundles(BundleCollection bundles)
        {
            AddAppBundles(bundles);
            var appJs = new ScriptBundle("~/scripts/app").Include(
                    "~/scripts/jquery-{version}.js",
                    "~/scripts/bootstrap.js",
                    "~/scripts/angular.js",
                    "~/scripts/angular-route.js",
                    "~/scripts/angular-cookies.js",
                    "~/scripts/ui-bootstrap-tpls-{version}.js",
                    "~/scripts/jquery.signalR-{version}.js");

            bundles.Add(appJs);

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                      "~/Scripts/jquery.validate*"));

            var appCss = new StyleBundle("~/content/app").Include(
                    "~/content/bootstrap.css",
                    "~/content/planninglab.css");

            bundles.Add(appCss);


        }

        private static void AddAppBundles(BundleCollection bundles)
        {
            var scriptBundle = new ScriptBundle("~/js/app");
            var adminAppDirFullPath = HttpContext.Current.Server.MapPath(string.Format("~/{0}", AppDir));
            if (Directory.Exists(adminAppDirFullPath))
            {
                scriptBundle.Include(
                    // Order matters, so get the core app setup first
                    string.Format("~/{0}/app.modules.js", AppDir)
                    )

                    // then get any other top level js files
                    .IncludeDirectory(string.Format("~/{0}", AppDir), "*.js", false)
                    // then get all nested module js files
                    .IncludeDirectory(string.Format("~/{0}", AppDir), "*.module.js", true)
                    // finally, get all the other js files
                    .IncludeDirectory(string.Format("~/{0}", AppDir), "*.js", true);
            }
            bundles.Add(scriptBundle);
        }
    }
}
