import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2, Pencil } from "lucide-react";
import clsx from "clsx";

export default function TreeView({ initialData = [] }) {
  const [treeData, setTreeData] = useState(initialData);

  const toggleNode = (node) => {
    node.expanded = !node.expanded;
    setTreeData([...treeData]);
  };

  const handleAddNode = (parent) => {
    const newNode = {
      id: Date.now(),
      label: "Новый узел",
      children: [],
      expanded: true,
      editing: true,
    };
    parent.children = parent.children || [];
    parent.children.push(newNode);
    parent.expanded = true;
    setTreeData([...treeData]);
  };

  const handleAddRoot = () => {
    const newNode = {
      id: Date.now(),
      label: "Новый узел",
      children: [],
      expanded: true,
      editing: true,
    };
    setTreeData([...treeData, newNode]);
  };

  const handleDeleteNode = (id, nodes = treeData) => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === id) {
        nodes.splice(i, 1);
        setTreeData([...treeData]);
        return;
      } else if (nodes[i].children) {
        handleDeleteNode(id, nodes[i].children);
      }
    }
  };

  const handleRename = (node, label) => {
    node.label = label;
    node.editing = false;
    setTreeData([...treeData]);
  };

  const renderTree = (nodes, level = 0) => {
    return nodes.map((node) => (
      <div key={node.id} className="ml-4">
        <div className="flex items-center gap-2 py-1">
          {node.children?.length > 0 ? (
            <button onClick={() => toggleNode(node)} className="text-[--color-primary]">
              {node.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : (
            <div className="w-4" />
          )}

          {node.editing ? (
            <input
              type="text"
              autoFocus
              defaultValue={node.label}
              onBlur={(e) => handleRename(node, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename(node, e.target.value);
              }}
              className="text-sm border-b border-[--color-primary] bg-transparent text-[--color-primary] focus:outline-none"
            />
          ) : (
            <span
              className="text-sm text-[--color-primary] font-[Onest] cursor-pointer"
              onDoubleClick={() => {
                node.editing = true;
                setTreeData([...treeData]);
              }}
            >
              {node.label}
            </span>
          )}

          <div className="flex items-center gap-1 ml-auto">
            <button onClick={() => handleDeleteNode(node.id)} className="text-[--color-secondary] hover:text-red-500">
              <Trash2 size={14} />
            </button>
            <button onClick={() => handleAddNode(node)} className="text-[--color-secondary]">
              <Plus size={14} />
            </button>
          </div>
        </div>
        {node.expanded && node.children && (
          <div className="ml-4 border-l border-dashed border-[--color-border] pl-2">
            {renderTree(node.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="bg-white border border-[--color-border] rounded p-3">
      <div className="flex justify-end mb-2">
        <Button onClick={handleAddRoot} size="sm">Добавить раздел</Button>
      </div>
      {renderTree(treeData)}
    </div>
  );
}

function Button({ onClick, children, size = "base" }) {
  const sizeClass = size === "sm" ? "px-3 py-1 text-sm" : "px-4 py-2";
  return (
    <button
      onClick={onClick}
      className={clsx(
        "bg-[--color-primary] text-white rounded hover:bg-[--color-secondary] transition",
        sizeClass
      )}
    >
      {children}
    </button>
  );
}