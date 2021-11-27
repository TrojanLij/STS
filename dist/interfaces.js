"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPCode = void 0;
//https://www.restapitutorial.com/httpstatuscodes.html
var HTTPCode;
(function (HTTPCode) {
    //1xx Informational
    HTTPCode[HTTPCode["Continue"] = 100] = "Continue";
    HTTPCode[HTTPCode["SwitchingProtocols"] = 101] = "SwitchingProtocols";
    HTTPCode[HTTPCode["ProcessingWebDAV"] = 102] = "ProcessingWebDAV";
    //2xx Success
    HTTPCode[HTTPCode["OK"] = 200] = "OK";
    HTTPCode[HTTPCode["Created"] = 201] = "Created";
    HTTPCode[HTTPCode["Accepted"] = 202] = "Accepted";
    HTTPCode[HTTPCode["NonAuthoritativeInformation"] = 203] = "NonAuthoritativeInformation";
    HTTPCode[HTTPCode["NoContent"] = 204] = "NoContent";
    HTTPCode[HTTPCode["ResetContent"] = 205] = "ResetContent";
    HTTPCode[HTTPCode["PartialContent"] = 206] = "PartialContent";
    HTTPCode[HTTPCode["MultiStatusWebDAV"] = 207] = "MultiStatusWebDAV";
    HTTPCode[HTTPCode["AlreadyReportedWebDAV"] = 208] = "AlreadyReportedWebDAV";
    HTTPCode[HTTPCode["IMUsed"] = 226] = "IMUsed";
    //3xx Redirection
    HTTPCode[HTTPCode["MultipleChoices"] = 300] = "MultipleChoices";
    HTTPCode[HTTPCode["MovedPermanently"] = 301] = "MovedPermanently";
    HTTPCode[HTTPCode["Found"] = 302] = "Found";
    HTTPCode[HTTPCode["SeeOther"] = 303] = "SeeOther";
    HTTPCode[HTTPCode["NotModified"] = 304] = "NotModified";
    HTTPCode[HTTPCode["UseProxy"] = 305] = "UseProxy";
    HTTPCode[HTTPCode["Unused"] = 306] = "Unused";
    HTTPCode[HTTPCode["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HTTPCode[HTTPCode["PermanentRedirectExperimental"] = 308] = "PermanentRedirectExperimental";
    //4xx Client Error
    HTTPCode[HTTPCode["BadRequest"] = 400] = "BadRequest";
    HTTPCode[HTTPCode["Unauthorized"] = 401] = "Unauthorized";
    HTTPCode[HTTPCode["PaymentRequired"] = 402] = "PaymentRequired";
    HTTPCode[HTTPCode["Forbidden"] = 403] = "Forbidden";
    HTTPCode[HTTPCode["NotFound"] = 404] = "NotFound";
    HTTPCode[HTTPCode["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HTTPCode[HTTPCode["NotAcceptable"] = 406] = "NotAcceptable";
    HTTPCode[HTTPCode["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HTTPCode[HTTPCode["RequestTimeout"] = 408] = "RequestTimeout";
    HTTPCode[HTTPCode["Conflict"] = 409] = "Conflict";
    HTTPCode[HTTPCode["Gone"] = 410] = "Gone";
    HTTPCode[HTTPCode["LengthRequired"] = 411] = "LengthRequired";
    HTTPCode[HTTPCode["PreconditionFailed"] = 412] = "PreconditionFailed";
    HTTPCode[HTTPCode["RequestEntityTooLarge"] = 413] = "RequestEntityTooLarge";
    HTTPCode[HTTPCode["RequestURITooLong"] = 414] = "RequestURITooLong";
    HTTPCode[HTTPCode["UnsupportedMediaType"] = 415] = "UnsupportedMediaType";
    HTTPCode[HTTPCode["RequestedRangeNotSatisfiable"] = 416] = "RequestedRangeNotSatisfiable";
    HTTPCode[HTTPCode["ExpectationFailed"] = 417] = "ExpectationFailed";
    HTTPCode[HTTPCode["IAmaTeapotRFC2324"] = 418] = "IAmaTeapotRFC2324";
    HTTPCode[HTTPCode["EnhanceYourCalmTwitter"] = 420] = "EnhanceYourCalmTwitter";
    HTTPCode[HTTPCode["UnprocessableEntityWebDAV"] = 422] = "UnprocessableEntityWebDAV";
    HTTPCode[HTTPCode["LockedWebDAV"] = 423] = "LockedWebDAV";
    HTTPCode[HTTPCode["FailedDependencyWebDAV"] = 424] = "FailedDependencyWebDAV";
    HTTPCode[HTTPCode["ReservedforWebDAV"] = 425] = "ReservedforWebDAV";
    HTTPCode[HTTPCode["UpgradeRequired"] = 426] = "UpgradeRequired";
    HTTPCode[HTTPCode["PreconditionRequired"] = 428] = "PreconditionRequired";
    HTTPCode[HTTPCode["TooManyRequests"] = 429] = "TooManyRequests";
    HTTPCode[HTTPCode["RequestHeaderFieldsTooLarge"] = 431] = "RequestHeaderFieldsTooLarge";
    HTTPCode[HTTPCode["NoResponseNginx"] = 444] = "NoResponseNginx";
    HTTPCode[HTTPCode["RetryWithMicrosoft"] = 449] = "RetryWithMicrosoft";
    HTTPCode[HTTPCode["BlockedByWindowsParentalControlsMicrosoft"] = 450] = "BlockedByWindowsParentalControlsMicrosoft";
    HTTPCode[HTTPCode["UnavailableForLegalReasons"] = 451] = "UnavailableForLegalReasons";
    HTTPCode[HTTPCode["ClientClosedRequestNginx"] = 499] = "ClientClosedRequestNginx";
    //5xx Server Error
    HTTPCode[HTTPCode["InternalServerError"] = 500] = "InternalServerError";
    HTTPCode[HTTPCode["NotImplemented"] = 501] = "NotImplemented";
    HTTPCode[HTTPCode["BadGateway"] = 502] = "BadGateway";
    HTTPCode[HTTPCode["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HTTPCode[HTTPCode["GatewayTimeout"] = 504] = "GatewayTimeout";
    HTTPCode[HTTPCode["HTTPVersionNotSupported"] = 505] = "HTTPVersionNotSupported";
    HTTPCode[HTTPCode["VariantAlsoNegotiatesExperimental"] = 506] = "VariantAlsoNegotiatesExperimental";
    HTTPCode[HTTPCode["InsufficientStorageWebDAV"] = 507] = "InsufficientStorageWebDAV";
    HTTPCode[HTTPCode["LoopDetectedWebDAV"] = 508] = "LoopDetectedWebDAV";
    HTTPCode[HTTPCode["BandwidthLimitExceededApache"] = 509] = "BandwidthLimitExceededApache";
    HTTPCode[HTTPCode["NotExtended"] = 510] = "NotExtended";
    HTTPCode[HTTPCode["NetworkAuthenticationRequired"] = 511] = "NetworkAuthenticationRequired";
    HTTPCode[HTTPCode["NetworkReadTimeoutError"] = 598] = "NetworkReadTimeoutError";
    HTTPCode[HTTPCode["NetworkConnectTimeoutError"] = 599] = "NetworkConnectTimeoutError";
})(HTTPCode = exports.HTTPCode || (exports.HTTPCode = {}));