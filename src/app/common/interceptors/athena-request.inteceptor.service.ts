import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Guid} from '../guid/guid';
import {Observable} from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class AthenaRequestInteceptorService implements HttpInterceptor {

  public static HEADER_TRACE_ID = 'X-B3-TraceId';
  public static HEADER_SPAN_ID = 'X-B3-SpanId';
  private  static HEADER_CONTEXT_TYPE = 'Content-Type';
  private  static DEFAULT_CONTEXT_TYPE = 'application/json';

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const headers = {};

    if (!request.headers.has(AthenaRequestInteceptorService.HEADER_TRACE_ID)) {
      const traceId = Guid.newGuid();
      headers[AthenaRequestInteceptorService.HEADER_TRACE_ID] = traceId;
      headers[AthenaRequestInteceptorService.HEADER_SPAN_ID] =  traceId;
    } else {
      console.debug('Trace id is already present');
      headers[AthenaRequestInteceptorService.HEADER_SPAN_ID] =  request.headers.get(AthenaRequestInteceptorService.HEADER_TRACE_ID);
    }




    if (!request.headers.has(AthenaRequestInteceptorService.HEADER_CONTEXT_TYPE)) {
      headers[AthenaRequestInteceptorService.HEADER_CONTEXT_TYPE] =  AthenaRequestInteceptorService.DEFAULT_CONTEXT_TYPE;
    } else {
      console.debug('Context-Type is already present');
    }

    request = request.clone({
      setHeaders: headers
    });

    return next.handle(request);
  }
}
