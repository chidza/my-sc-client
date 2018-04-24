namespace mrs.data {
    "use strict";

    export interface IPageRequest {
        page?: number;
        size?: number;
        sort?: Array<string>;
    }

    export interface IPageReponse<T> extends ng.resource.IResource<IPageReponse<T>> {
        content: T[];
        totalElements: number;
        totalPages: number;
        last: boolean;
        first: boolean;
        numberOfElements: number;
        sort?: any;
        size: number;
        number: number;
    }

    export interface IResourceService<TEntity> extends ng.resource.IResourceClass<TEntity> {
        update: ng.resource.IResourceMethod<TEntity>;
    }

    export interface IEntity extends ng.resource.IResource<IEntity> {
        createdBy?: string;
        createdDate?: Date;
        lastModifiedBy?: string;
        lastModifiedDate?: Date;
    }

    export interface IAggregateRoot<TID> extends IEntity {
        id: TID;
    }

    export interface IAggregateRootService<TEntity, ID> {
        get(id: ID): ng.IPromise<TEntity>;
        save(entity: TEntity): ng.IPromise<TEntity>;
        update(entity: TEntity): ng.IPromise<TEntity>;
        remove(id: ID): ng.IPromise<TEntity>;
    }

    export interface ITerminologyEntity<TID> extends IAggregateRoot<TID> {
        discontinued: boolean;
    }

}