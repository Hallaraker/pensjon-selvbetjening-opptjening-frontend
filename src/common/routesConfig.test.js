import {basePath, routesConfig} from "./routesConfig"
import {HomePage} from "../components/pages/HomePage/HomePage";
import {NotFoundPage} from "../components/pages/NotFoundPage/NotFoundPage";



it('should return all defined routes', () => {
    expect(basePath).toEqual(process.env.PUBLIC_URL);
    expect(routesConfig.length).toEqual(2);

    expect(routesConfig[0].path).toEqual("/");
    expect(routesConfig[0].titleKey).toEqual("opptjening-title");
    expect(routesConfig[0].component).toEqual(HomePage);

    expect(routesConfig[1].path).toEqual("/404");
    expect(routesConfig[1].titleKey).toEqual("404-title");
    expect(routesConfig[1].component).toEqual(NotFoundPage);
});
