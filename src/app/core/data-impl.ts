namespace mrs.data {
    "use strict";

    export abstract class EntityService<TEntity extends IAggregateRoot<ID>, ID, TResource extends IResourceService<TEntity>>
        implements IAggregateRootService<TEntity, ID> {

        private _resource: TResource;

        constructor(resource: TResource) {
            this._resource = resource;
        }
        get = (id: ID): ng.IPromise<TEntity> => {
            return this.getResource().get({ id: id }).$promise;
        }

        save = (entity: TEntity): ng.IPromise<TEntity> => {
            return this.getResource().save(entity).$promise;
        }

        update = (entity: TEntity): ng.IPromise<TEntity> => {
            return this.getResource().update(entity).$promise;
        }

        remove = (id: ID): ng.IPromise<TEntity> => {
            return this.getResource().delete({ id: id }).$promise;
        }

        protected getResource = (): TResource => { return this._resource; };

    }

}