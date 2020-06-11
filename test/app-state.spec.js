import {expect} from 'chai';
import sinon from 'sinon';
import PouchDB from 'pouchdb';
import PouchMemoryAdapter from 'pouchdb-adapter-memory';
import {Storage as AppStorage} from '../src/js/storage';
import {State} from '../src/js/state';
import {Task} from '../src/js/task';
import {UrlBuilder} from '../src/js/url-builder';
import {take} from 'rxjs/operators';

suite('State', () => {
  PouchDB.plugin(PouchMemoryAdapter);

  /**
   * @type {AppStorage}
   */
  let storage = null;
  /**
   * @type {State}
   */
  let state = null;

  setup(async () => {
    const urlBuilder = new UrlBuilder().setDatabaseName(
      '__mocha__' + Date.now(),
    );
    storage = new AppStorage(urlBuilder, null, {
      adapter: 'memory',
    });
    await storage.clearStorage();
    state = new State(storage);
  });

  test("calling syncStorageFrom should call storage's connectTo with the appropriate urls", async () => {
    sinon.spy(storage);
    await state.syncStorageFrom('foo');

    expect(storage.connectTo).to.have.been.calledWith('foo');
  });

  test('upon subscription should emit tasks', async () => {
    const tasksObservableSpy = sinon.fake();

    state.tasks.subscribe(tasksObservableSpy, null, null);

    expect(tasksObservableSpy).to.be.calledWithMatch([]);
  });

  test('upon subscription should emit categories', async () => {
    const categoriesObservableSpy = sinon.fake();
    await state.addNewTask('unit test');

    state.categories.subscribe(categoriesObservableSpy, null, null);

    expect(categoriesObservableSpy).to.be.calledWithMatch(new Set(['Default']));
  });

  test('upon subscription should emit selected category', () => {
    state.selectedCategory.subscribe((selectedCategory) => {
      expect(selectedCategory).to.match(/Default/i);
    });
  });

  test('calling addNewTask should emit the task in the tasks observable', async () => {
    await state.addNewTask('unit test');
    state.tasks.subscribe((tasks) => {
      expect(tasks.map((t) => t.content)).to.deep.include('unit test');
    });
  });

  test('calling toggleTaskState should emit the updated task in the tasks observable', async () => {
    const task = await state.addNewTask('unit test');
    await state.toggleTaskState(task.id);
    state.tasks.subscribe((tasks) => {
      expect(tasks.map((t) => t.done)).to.deep.include(true);
    });
  });

  test('calling updateTaskContent should emit the updated task in the tasks observable', async () => {
    const task = await state.addNewTask('unit test');
    await state.updateTaskContent(task.id, 'updated');
    state.tasks.subscribe((tasks) => {
      expect(tasks.map((t) => t.content)).to.deep.include('updated');
    });
  });

  test('calling deleteTask should remove the task from the tasks observable', async () => {
    const task = await state.addNewTask('unit test');
    await state.deleteTask(task.id);
    state.tasks.subscribe((tasks) => {
      expect(tasks.map((t) => t.id)).to.not.deep.include(task.id);
    });
  });

  test('calling createNewCategory should emit the new category in the categories observable', async () => {
    await state.createNewCategory('special');

    state.categories.subscribe((categories) => {
      expect(categories.has('special')).to.be.true;
    });
  });

  test('creating task with new category should emit the new category in the categories observable', async () => {
    const task = await state.addNewTask('unit test', 'special');
    expect(task.category).to.equal('special');

    state.categories.subscribe((categories) => {
      expect(categories.has('special')).to.be.true;
    });
  });

  test('calling selectCategory should emit selectedCategory and tasks observables', async () => {
    await state.addNewTask('unit test', 'special');
    state.selectCategory('special');

    state.selectedCategory.subscribe((selectedCategory) => {
      expect(selectedCategory).to.equal('special');
    });
    state.tasks.subscribe((tasks) => {
      expect(tasks.map((t) => t.category)).to.include('special');
      expect(tasks.map((t) => t.category)).to.not.include('Default');
    });
  });

  test('calling deleteCategory should move all its tasks to default and remove the category', async () => {
    await state.addNewTask('unit test', 'special');
    state.categories.pipe(take(1)).subscribe((categories) => {
      expect(categories).to.deep.include('special');
    });
    state.tasks.pipe(take(1)).subscribe((tasks) => {
      expect(tasks.map((t) => t.content)).to.not.deep.include('unit test');
    });

    await state.deleteCategory('special');
    state.categories.pipe(take(1)).subscribe((categories) => {
      expect(categories.has('special')).to.be.false;
    });
    state.tasks.pipe(take(1)).subscribe((tasks) => {
      expect(tasks.map((t) => [t.content, t.category])).to.deep.include([
        'unit test',
        'Default',
      ]);
    });
  });

  test('call to clearAllFinishedTasks should reflected in storage', async () => {
    const task = await state.addNewTask('foo');
    await state.toggleTaskState(task.id);

    return state.clearAllFinishedTasks().then(() => {
      state.tasks.subscribe((tasks) => {
        expect(tasks).to.deep.equal([]);
      });
    });
  });

  test('call to clearAllTasks should reflected in storage', async () => {
    const tasksObservableSpy = sinon.fake();
    state.tasks.subscribe(tasksObservableSpy);

    await state.clearAllTasks();
    expect(tasksObservableSpy.thirdCall.lastArg).to.deep.equal([]);
  });
});
